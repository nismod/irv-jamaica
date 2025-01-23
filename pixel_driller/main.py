import logging
import os
from pathlib import Path

import fastapi
from fastapi import FastAPI
import pandas as pd
from pyproj import CRS

from .query import point_query, RasterStackMetadata


def read_grid_metadata(target_path: Path) -> list[RasterStackMetadata]:
    datasets = pd.read_csv(target_path / "stacks.csv")
    return [
        RasterStackMetadata(ds.grid_id, target_path / ds.fname, CRS(ds.crs))
        for ds in datasets.itertuples()
    ]


logging.basicConfig(format="%(asctime)s %(filename)s %(message)s", level=logging.INFO)

DATA_PATH = os.getenv("PIXEL_STACK_DATA_DIR", "/data")
DATASETS = read_grid_metadata(Path(DATA_PATH))

# ORJSON to permit NaN values in JSON response
app = FastAPI(default_response_class=fastapi.responses.ORJSONResponse)

@app.get("/{lon}/{lat}")
async def get_values_at_point(lon: float, lat: float):
    return point_query(DATASETS, lon, lat)
