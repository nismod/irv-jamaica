import unittest
from pathlib import Path

from query import point_query, RasterStackMetadata


class QueryRasterTestCase(unittest.TestCase):
    def test_query_raster(self):
        datasets = [
            RasterStackMetadata(
                "test", Path(__file__).parent / "fixtures" / "test.zarr", "EPSG:4326"
            )
        ]
        actual = point_query(datasets, 0.0, 0.0)
        expected = [
            {"key": "a", "band_data": 0.0},
            {"key": "b", "band_data": 1.0},
            {"key": "c", "band_data": 2.0},
            {"key": "d", "band_data": 3.0},
        ]
        self.assertEqual(len(actual), 4)
        self.assertEqual(actual, expected)

        actual = point_query(datasets, 0.1, 0.1)
        expected = [
            {"key": "a", "band_data": 12.0},
            {"key": "b", "band_data": 13.0},
            {"key": "c", "band_data": 14.0},
            {"key": "d", "band_data": 15.0},
        ]
        self.assertEqual(len(actual), 4)
        self.assertEqual(actual, expected)


if __name__ == "__main__":
    unittest.main()
