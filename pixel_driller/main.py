import asyncio
import os

from fastapi import FastAPI
from fastapi.exceptions import HTTPException
from rasterio import open
from rasterio.windows import Window
from ingest import stack


def query_raster_at_point(raster_path, x, y):
    """
    Query a raster file with multiple bands to extract the values at a specific (x, y) coordinate.

    Parameters:
        raster_path (str): Path to the raster file.
        x (float): X-coordinate in the raster's CRS.
        y (float): Y-coordinate in the raster's CRS.

    Returns:
        dict: A dictionary where keys are band 'source' tags and values are the pixel values at (x, y).
    """
    with open(raster_path) as src:
        # Transform the x, y geographic coordinate into the raster's row, col
        # row, col = src.index(x, y)
        # window = Window(col, row, 1, 1)  # Window of 1x1 pixel
        window = Window(x, y, 1, 1)

        # Dictionary to store the band 'source' tag and pixel value
        band_values = {}

        for i in range(1, src.count + 1):  # Iterate through all bands (1-indexed in rasterio)
            # Get the tag metadata for this band
            band_tags = src.tags(i)
            band_source = band_tags.get('source', f'band_{i}')  # Default to 'band_i' if no source tag

            # Read the exact pixel value using a windowed read
            data = src.read(i, window=window)

            # Store the pixel value in the dictionary
            band_values[band_source] = float(data[0, 0])  # Extract the single value from the 1x1 array

    return band_values


async def async_stack(in_path):
    stack(in_path=in_path)


app = FastAPI()

data_file = "./.output/stack.tif"


@app.get("/{x}/{y}")
async def get_values_at_point(x: str, y: str):
    x = int(x)
    y = int(y)
    out = query_raster_at_point(data_file, x, y)
    return out


@app.post("/reimport")
async def reimport(args):
    if "code" not in args:
        raise HTTPException(status_code=403, detail="Missing 'code' in request body.")
    if args["code"] != os.environ.get("ADMIN_CODE"):
        raise HTTPException(status_code=403, detail="Invalid 'code' in request body.")
    in_dir = os.environ.get("DATA_SOURCE_DIR")
    if not os.path.isdir(in_dir):
        raise HTTPException(status_code=500, detail="Data source directory not found.")
    asyncio.run(async_stack(in_path=in_dir))
    return {"message": "Data reimport job started."}
