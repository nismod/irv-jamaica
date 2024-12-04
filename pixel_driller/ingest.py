"""
Conversion of rasters into database tables.

Based on https://github.com/nismod/scale-nav/blob/main/src/scalenav/rast_converter.py
"""
import os
from re import search
from glob import glob
from numpy import meshgrid, arange, array, ones, float32

from rasterio.transform import xy
from rasterio import open
import geopandas as gpd
from rasterio.warp import reproject, Resampling
from rasterio.plot import show
from time import time

data_path = "../tileserver/raster/data"


def check_path(in_path):
    """What are we checking ?
    - input contains one of the desired file resolutions.
    - if folder file, extract all raster format files from it.
    - if specific file, then just use that.
    - some robustness to user input should be embedded here. For example when providing folder path: '/the/folder/with/rast/' and /the/folder/with/rast' as two potential accepted values.
    - also relative and absolute paths.

    """

    if in_path[len(in_path) - 1] != '/':
        in_path = in_path + '/'

    in_paths = [str(x) for x in glob(in_path + "**", recursive=True) if
                search(pattern=r"(.ti[f]{1,2}$)|(.nc$)", string=x)]

    #  print("Reading in from",len(in_paths), "files.")

    return in_paths


def check_nodata(source):
    """
    """
    if len(source.nodatavals) > 1:
        print("Using first no data value")
        return source.nodatavals[0]
    else:
        return source.nodatavals[0]
    # return source.nodatavals


def check_crs(source):
    """
    """
    return source.crs if source.crs is not None else "epsg:4326"


def stack(
        in_path="./dummy_data/",
        out_path="./.output/stack.tif",
        ref_raster_path="./dummy_data/coastal__rp_100__rcp_8x5__epoch_2100__conf_None.tif",
        plots=False,
):
    start_time = time()
    file_times = []
    in_paths = check_path(in_path=in_path)

    if len(in_paths) == 0:
        raise IOError("No input files recognised.")

    print("Reading the following file(s): ", *in_paths)

    print("Writing to ", out_path)

    print("Reference raster: ", ref_raster_path)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(ref_raster_path) as ref_raster:
        # ref_profile = ref_raster.profile
        ref_transform = ref_raster.transform
        ref_crs = check_crs(ref_raster)
        ref_width = ref_raster.width
        ref_height = ref_raster.height
        ref_nodata = check_nodata(ref_raster)

    with open(
            out_path,
            "w",
            driver="GTiff",
            height=ref_height,
            width=ref_width,
            count=len(in_paths),
            dtype="float32",
            crs=ref_crs,
            transform=ref_transform,
            nodata=ref_nodata,
    ) as out:
        for i, p in enumerate(in_paths):
            with open(p) as src:
                f_start_time = time()
                # Transform the source raster to the same crs and transform as the first raster
                input = src.read()
                # Check that the nodata value is the same
                if src.nodatavals[0] != ref_nodata:
                    # Set the nodata value to the same as the first raster
                    input[input == src.nodatavals[0]] = ref_nodata
                if plots:
                    show(input, title=f"{p} before reprojecting")
                band = ones((ref_height, ref_width), float32) * ref_nodata
                reproject(
                    source=input,
                    destination=band,
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=ref_transform,
                    dst_crs=ref_crs,
                    dst_width=ref_width,
                    dst_height=ref_height,
                    resampling=Resampling.bilinear
                )
                if plots:
                    show(band, title=f"{p} after reprojecting")
                out.write_band(i + 1, band)
                out.update_tags(i + 1, **src.tags(), source=os.path.basename(p))
                file_times.append(time() - f_start_time)

    print(f"Finished {len(in_paths)} files in {time() - start_time:.2f}s")
    print(f"Average time per file: {sum(file_times) / len(file_times):.2f}s")
    max_f_time = max(file_times)
    slowest_file_index = file_times.index(max_f_time)
    print(f"Slowest file ({in_paths[slowest_file_index]}) took {max(file_times):.2f}s")

    if plots:
        src = open(out_path)
        show(src, title="Stacked rasters")
