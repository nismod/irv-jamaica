import shutil
import unittest
from pathlib import Path

import pandas as pd
import xarray as xr

from ingest import stack


class IngestTestCase(unittest.TestCase):
    def test_ingest(self):
        source_path = Path(__file__).parent / "fixtures" / "single_band"
        target_path = Path(__file__).parent / "fixtures" / "output"
        out_file = target_path / "test.zarr"
        if out_file.exists():
            shutil.rmtree(out_file)

        # layers created by make_fixtures
        layers = pd.DataFrame(
            {"path": ["a.tif", "b.tif", "c.tif", "d.tif"], "key": ["a", "b", "c", "d"]}
        )
        layers["grid_id"] = "test"
        grids = pd.DataFrame({"grid_id": ["test"], "fname": ["test.zarr"]})
        stack(source_path, target_path, layers, grids)

        # Check we can open the file and it has the expected dimensions
        ds = xr.open_zarr(out_file)
        expected_dims = {"key": 4, "y": 10, "x": 10}
        self.assertEqual(ds.dims, expected_dims)


if __name__ == "__main__":
    unittest.main()
