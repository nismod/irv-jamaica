from dataclasses import dataclass
import logging
from pathlib import Path

import pandas as pd
from pyproj import CRS
from pyproj.transformer import Transformer
import xarray as xr


LAYER_METADATA_SCHEMA = [
    "key",
    "hazard",
    "rp",
    "rcp",
    "epoch",
    "confidence",
    "variable",
    "unit",
]


@dataclass
class RasterStackMetadata:
    """Metadata about each stack of rasters (those sharing a grid)"""

    name: str
    path: Path
    crs: CRS


def point_query(
    datasets: list[RasterStackMetadata],
    layer_metadata: pd.DataFrame,
    lon: float,
    lat: float,
) -> dict[str, list]:
    """
    Query a raster file with multiple bands to extract the values at a specific (x, y) coordinate.

    Parameters:
        datasets: Metadata about the grids shared by raster layers
        layer_metadata: Metadata about the individual raster layers
        x: longitude coordinate
        y: latitude coordinate

    Returns:
        dict: A dictionary of column names to lists of values. `band_data`
            contains the raster values.
    """
    dfs = []
    for dataset in datasets:
        t = Transformer.from_crs("EPSG:4326", dataset.crs)
        tx, ty = t.transform(lon, lat)
        ds = xr.open_zarr(dataset.path)

        if tx < ds.x.min() or tx > ds.x.max() or ty < ds.y.min() or ty > ds.y.max():
            # out of bounds for this dataset
            logging.debug(f"Point {lon=}, {lat=} outside bounds for {dataset.name=}")
            continue

        dfs.append(
            ds.sel(x=tx, y=ty, method="nearest")
            .drop_vars(["x", "y"])
            .to_dataframe()
            .reset_index()
        )

    if dfs:
        data = (
            pd.concat(dfs)
            .merge(layer_metadata, on="key")
            .loc[:, LAYER_METADATA_SCHEMA + ["band_data"]]
        )
        return data.to_dict(orient="list")
    else:
        return {}
