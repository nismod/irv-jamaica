from dataclasses import dataclass
from pathlib import Path

import pandas as pd
import xarray as xr
from pyproj import CRS
from pyproj.transformer import Transformer


METADATA: pd.DataFrame = pd.read_csv("/data/hazard_layers.csv")


@dataclass
class RasterStackMetadata:
    """Metadata about each stack of rasters"""

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
        df = (
            xr.open_zarr(dataset.path)
            .sel(x=tx, y=ty, method="nearest")
            .drop_vars(["x", "y"])
            .to_dataframe()
            .fillna(0)
            .reset_index()
        )
        dfs.append(df)
    data = pd.concat(dfs)

    data = data.merge(METADATA, on="key").loc[
        :,
        [
            "key",
            "band_data",
            "hazard",
            "rp",
            "rcp",
            "epoch",
            "confidence",
            "variable",
            "unit",
        ],
    ]

    response: dict[str, list] = {}
    for col in data.columns:
        response[col] = data[col].tolist()

    return response
