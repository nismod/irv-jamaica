"""Stack rasters into queryable format
"""

import sys
from pathlib import Path

import pandas as pd
import snail.intersection
import xarray as xr
from tqdm.auto import tqdm


def read_grids(
    source_path: Path, layers: pd.DataFrame
) -> tuple[pd.DataFrame, pd.DataFrame]:
    # First read metadata from each raster file
    # keep track of unique grid definitions, give them ids
    grid_lookup: dict[snail.intersection.GridDefinition, str] = {}
    layer_grid_ids: list[str] = []

    for layer in tqdm(
        layers.itertuples(), total=len(layers), desc="Reading layer metadata"
    ):
        grid_path = source_path / layer.path
        grid = snail.intersection.GridDefinition.from_raster(grid_path)
        if grid not in grid_lookup:
            grid_id = f"grid_{len(grid_lookup)}"
            grid_lookup[grid] = grid_id
        else:
            grid_id = grid_lookup[grid]
        layer_grid_ids.append(grid_id)

    # Transform unique grid definitions into data table for reference as metadata
    grid_data = []
    for grid, grid_id in grid_lookup.items():
        grid_data.append(
            {
                "crs": str(grid.crs),
                "width": grid.width,
                "height": grid.height,
                "transform": grid.transform,
                "grid_id": grid_id,
            }
        )
    grids = pd.DataFrame(grid_data)
    layers["grid_id"] = layer_grid_ids

    return layers, grids


def stack(
    source_path: Path, target_path: Path, layers: pd.DataFrame, grids: pd.DataFrame
):
    grid_fname_lookup = grids.set_index("grid_id")

    for grid_id, grid_layers in layers.groupby("grid_id"):
        var = xr.Variable("key", grid_layers.key.tolist())
        layer_paths = grid_layers.path.tolist()
        print("Processing", len(layer_paths), "layers for", grid_id)
        ds = (
            xr.concat(
                [
                    xr.open_dataset(source_path / layer_path, engine="rasterio")
                    for layer_path in layer_paths
                ],
                dim=var,
            )
            .squeeze("band", drop=True)
            .drop_vars("spatial_ref")
        )
        # Trade-off in chunk size vs number of files
        # (smaller chunks -> more files -> slower to write, unknown effect on reads)
        # 10 10 100 wrote in 1m10 - 180byte to 22k chunk files
        # 100 100 100 wrote in 1.9s - 11k to 1.1M chunk files
        # 1000 1000 100 wrote in 1.5s - 1.1M to 9.4M chunk files
        dsc = ds.chunk({"x": 100, "y": 100, "key": 1000})

        grid_fname = grid_fname_lookup.loc[grid_id, "fname"]

        dsc.to_zarr(target_path / grid_fname, mode="w-")


if __name__ == "__main__":
    try:
        source_path = Path(sys.argv[1])
        target_path = Path(sys.argv[2])
    except IndexError:
        print("Usage: python ingest.py <source_path> <target_path>")
        sys.exit()

    # CSV is structured like this:
    #   hazard,path,rp,rcp,epoch,confidence,key
    #   coastal,hazards/Coastal_flood_data/Flood_maps_future_climate/RCP26_2050/JamaicaJAM001RCP262050_epsg_32618_RP_1.tif,1,2.6,2050,,coastal__rp_1__rcp_2x6__epoch_2050__conf_None
    # path is relative to "source_path"
    # key is a unique compound string key that encodes (hazard,rp,rcp,epoch,confidence)
    layers_without_grid_ids = pd.read_csv(
        Path(__file__).parent / ".." / "etl" / "hazard_layers.csv"
    )
    layers, grids = read_grids(source_path, layers_without_grid_ids)

    # Conventional filename using grid_id - could drive this with data
    # e.g. to name like datasets/hazards
    grids["fname"] = grids.grid_id.apply(lambda grid_id: f"{grid_id}.zarr")

    stack(source_path, target_path, layers, grids)

    layers.to_csv(target_path / "layers.csv")
    grids.to_csv(target_path / "stacks.csv")
