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
        # must be always_xy to handle lon, lat and tx, ty in correct order
        t = Transformer.from_crs("EPSG:4326", dataset.crs, always_xy=True)
        tx, ty = t.transform(lon, lat)
        ds = xr.open_zarr(dataset.path)

        # extract bounds
        xmin, xmax, ymin, ymax = (
            float(ds.x.min()),
            float(ds.x.max()),
            float(ds.y.min()),
            float(ds.y.max()),
        )
        logging.debug(
            f"Query for {lon=}, {lat=} in {dataset.name=} {dataset.crs.to_string()} at {tx=}, {ty=} bounds {xmin=} {xmax=} {ymin=} {ymax=}"
        )

        if tx < xmin or tx > xmax or ty < ymin or ty > ymax:
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
