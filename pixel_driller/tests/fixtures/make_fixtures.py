import numpy as np
import rasterio
from rasterio.transform import from_origin


def create_single_band_raster(file_path, width, height, value=0, crs="EPSG:4326", nodata_value=None,
                              nodata_frequency=0.1):
    """
    Creates a single-band raster with constant or random values, occasionally introducing nodata values.

    Parameters:
        file_path (str): Path to save the raster.
        width (int): Width of the raster.
        height (int): Height of the raster.
        value (int or None): Constant value for the raster. If None, random values are used.
        crs (str): Coordinate Reference System for the raster.
        nodata_value (float or None): Value to use as nodata. If None, no nodata values are set.
        nodata_frequency (float): Probability of a cell being assigned the nodata value.
    """
    transform = from_origin(0, 0, 1, 1)  # Arbitrary transform
    data = np.full((height, width), value, dtype=np.float32) if value is not None else np.random.random((height, width))

    # Introduce nodata values randomly
    if nodata_value is not None:
        mask = np.random.random((height, width)) < nodata_frequency
        data[mask] = nodata_value

    with rasterio.open(
            file_path,
            "w",
            driver="GTiff",
            height=height,
            width=width,
            count=1,
            dtype=np.float32,
            crs=crs,
            transform=transform,
            nodata=nodata_value,
    ) as dst:
        dst.write(data, 1)


def create_multi_band_raster(file_path, width, height, band_count, crs="EPSG:4326", nodata_value=None,
                             nodata_frequency=0.1):
    """
    Creates a multi-band raster with tagged bands, occasionally introducing nodata values.

    Parameters:
        file_path (str): Path to save the raster.
        width (int): Width of the raster.
        height (int): Height of the raster.
        band_count (int): Number of bands.
        crs (str): Coordinate Reference System for the raster.
        nodata_value (float or None): Value to use as nodata. If None, no nodata values are set.
        nodata_frequency (float): Probability of a cell being assigned the nodata value.
    """
    transform = from_origin(0, 0, 1, 1)  # Arbitrary transform

    with rasterio.open(
            file_path,
            "w",
            driver="GTiff",
            height=height,
            width=width,
            count=band_count,
            dtype=np.float32,
            crs=crs,
            transform=transform,
            nodata=nodata_value,
    ) as dst:
        for i in range(1, band_count + 1):
            # Generate random data
            data = np.random.random((height, width)).astype(np.float32)

            # Introduce nodata values randomly
            if nodata_value is not None:
                mask = np.random.random((height, width)) < nodata_frequency
                data[mask] = nodata_value

            dst.write(data, i)
            # Add a "source" tag
            dst.update_tags(i, source=f"Band_{i}")


if __name__ == "__main__":
    # Generate single-band rasters with nodata values
    create_single_band_raster("single_band/raster_ref.tif", 16, 16, value=42, nodata_value=-9999, nodata_frequency=0.8)
    create_single_band_raster("single_band/raster_16x16.tif", 16, 16, nodata_value=np.nan, nodata_frequency=0.2)
    create_single_band_raster("single_band/raster_8x8.tif", 8, 8, nodata_value=-9999, nodata_frequency=0.3)
    create_single_band_raster("single_band/raster_32x32.tif", 32, 32, nodata_value=0, nodata_frequency=0.1)

    # Generate a multi-band raster with nodata values
    create_multi_band_raster("multiband_raster.tif", 16, 16, band_count=4, nodata_value=-9999, nodata_frequency=0.2)

