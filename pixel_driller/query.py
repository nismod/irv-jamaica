from dataclasses import dataclass
import logging
import os
from pathlib import Path

import pandas as pd
from pyproj import CRS
from pyproj.transformer import Transformer
import xarray as xr


# per layer metadata
RASTER_METADATA_SCHEMA = [
    "key",
    "hazard",
    "rp",
    "rcp",
    "epoch",
    "confidence",
    "variable",
    "unit",
]
RASTER_METADATA_PATH: str = os.getenv("RASTER_METADATA_PATH")
RASTER_METADATA: pd.DataFrame = pd.read_csv(RASTER_METADATA_PATH)
assert set(RASTER_METADATA_SCHEMA).issubset(set(RASTER_METADATA.columns))


@dataclass
class RasterStackMetadata:
    """Metadata about each stack of rasters (those sharing a grid)"""

    name: str
    path: Path
    crs: CRS


def point_query(datasets: list[RasterStackMetadata], lon: float, lat: float) -> dict[str, list]:
    """
    Query a raster file with multiple bands to extract the values at a specific (x, y) coordinate.

    Parameters:
        datasets (pandas.DataFrame): Metadata about the raster files.
        x (float): longitude coordinate
        y (float): latitude coordinate

    Returns:
        dict: A dictionary of column names to lists of values. `band_data`
            contains the raster values.
    """
    dfs = []
    for dataset in datasets:
        t = Transformer.from_crs("EPSG:4326", dataset.crs)
        tx, ty = t.transform(lon, lat)
        ds = xr.open_zarr(dataset.path)
        dfs.append(
            ds
            .sel(x=tx, y=ty, method="nearest")
            .drop_vars(["x", "y"])
            .to_dataframe()
            .reset_index()
        )

    if dfs:
        data = pd.concat(dfs).merge(RASTER_METADATA, on="key").loc[
            :,
            RASTER_METADATA_SCHEMA + ["band_data"]
        ]
        return data.to_dict(orient="list")
    else:
        return {}