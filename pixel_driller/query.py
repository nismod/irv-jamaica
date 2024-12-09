from dataclasses import dataclass
from pathlib import Path

import pandas as pd
import xarray as xr
from pyproj import CRS
from pyproj.transformer import Transformer


@dataclass
class RasterStackMetadata:
    """Metadata about each stack of rasters"""

    name: str
    path: Path
    crs: CRS


def point_query(datasets: list[RasterStackMetadata], lon: float, lat: float):
    """
    Query a raster file with multiple bands to extract the values at a specific (x, y) coordinate.

    Parameters:
        datasets (pandas.DataFrame): Metadata about the raster files.
        x (float): longitude coordinate
        y (float): latitude coordinate

    Returns:
        dict: A dictionary where keys are band 'source' tags and values are the pixel values at (x, y).
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
    out = pd.concat(dfs)
    return out.to_dict(orient="records")  # could go straight .to_json(orient="records")
