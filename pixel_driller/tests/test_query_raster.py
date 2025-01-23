import unittest
from pathlib import Path

import pandas as pd

import query
from query import point_query, RasterStackMetadata


class QueryRasterTestCase(unittest.TestCase):

    def assertDictEqual(self, a: dict, b: dict) -> bool:
        """
        Compare two dictionaries for equality recursively. Overrides
        unittest.TestCase.assertDictEqual.

        N.B. Order of dictionary keys does not matter.
        """
        if a.keys() != b.keys():
            return False
        for k in a.keys():
            if isinstance(a[k], dict):
                if not self.assertDictEqual(a[k], b[k]):
                    return False
            else:
                if a[k] != b[k]:
                    return False
        return True

    def test_assertDictEqual(self):
        self.assertTrue(self.assertDictEqual({}, {}))
        self.assertTrue(self.assertDictEqual({"a": [1,2,3]}, {"a": [1,2,3]}))
        self.assertTrue(self.assertDictEqual({"a": 1, "b": 2}, {"b": 2, "a": 1}))
        self.assertFalse(self.assertDictEqual({"a": [1,2,3]}, {"a": [1,2,4]}))
        self.assertTrue(self.assertDictEqual({"a": {"b": [1,2,3]}}, {"a": {"b": [1,2,3]}}))
        self.assertFalse(self.assertDictEqual({"a": {"b": [1,2,3]}}, {"a": {"b": [1,2,4]}}))

    def test_query_raster(self):

        # override metadata (for brevity) for test
        query.RASTER_METADATA_SCHEMA = ["key", "hazard"]
        query.RASTER_METADATA = pd.DataFrame(
            {
                "key": ["a", "b", "c", "d"],
                "hazard": ["coastal", "coastal", "fluvial", "cyclone"],
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
        }
        self.assertDictEqual(actual, expected)
        self.assertDictEqual({"hi": [1,2,3]}, {"hi": [1,2,3]})

        actual = point_query(datasets, 0.1, 0.1)
        expected = {
            "key": ["a", "b", "c", "d"],
            "band_data": [12, 13, 14, 15],
            "hazard": ["coastal", "coastal", "fluvial", "cyclone"],
        }
        self.assertDictEqual(actual, expected)

    def test_query_raster_out_of_bounds(self):
        datasets = [
            RasterStackMetadata(
                "test", Path(__file__).parent / "fixtures" / "test.zarr", "EPSG:4326"
            )
        ]
        actual = point_query(datasets, -1.0, 0.0)
        expected = {}
        self.assertDictEqual(actual, expected)


if __name__ == "__main__":
    unittest.main()
