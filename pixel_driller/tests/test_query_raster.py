import unittest
from pathlib import Path

import numpy as np
import pandas as pd

import query
from query import point_query, RasterStackMetadata


class QueryRasterTestCase(unittest.TestCase):
    def test_query_raster(self):

        # override METADATA for test
        query.METADATA = pd.DataFrame(
            {
                "key": ["a", "b", "c", "d"],
                "hazard": ["coastal", "coastal", "fluvial", "cyclone"],
                "rp": [1, 2, 5, 10],
                "rcp": ["2.6", "4.5", "4.5", "2.6"],
                "epoch": [2050, 2050, 2050, 2100],
                "confidence": [95.0, None, None, None],
                "variable": ["depth", "depth", "depth", "speed"],
                "unit": ["m", "m", "m", "m s-1"],
            }
        )
        datasets = [
            RasterStackMetadata(
                "test", Path(__file__).parent / "fixtures" / "test.zarr", "EPSG:4326"
            )
        ]
        actual = point_query(datasets, 0.0, 0.0)
        expected = {
            "key": ["a", "b", "c", "d"],
            "band_data": [0, 1, 2, 3],
            "hazard": ["coastal", "coastal", "fluvial", "cyclone"],
            "rp": [1, 2, 5, 10],
            "rcp": ["2.6", "4.5", "4.5", "2.6"],
            "epoch": [2050, 2050, 2050, 2100],
            "confidence": [95.0, np.nan, np.nan, np.nan],
            "variable": ["depth", "depth", "depth", "speed"],
            "unit": ["m", "m", "m", "m s-1"],
        }
        self.assertEqual(sorted(actual), sorted(expected))

        actual = point_query(datasets, 0.1, 0.1)
        expected = {
            "key": ["a", "b", "c", "d"],
            "band_data": [12, 13, 14, 15],
            "hazard": ["coastal", "coastal", "fluvial", "cyclone"],
            "rp": [1, 2, 5, 10],
            "rcp": ["2.6", "4.5", "4.5", "2.6"],
            "epoch": [2050, 2050, 2050, 2100],
            "confidence": [95.0, np.nan, np.nan, np.nan],
            "variable": ["depth", "depth", "depth", "speed"],
            "unit": ["m", "m", "m", "m s-1"],
        }
        self.assertEqual(sorted(actual), sorted(expected))


if __name__ == "__main__":
    unittest.main()
