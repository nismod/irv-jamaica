import unittest

import rasterio

from main import query_raster_at_point


class QueryRasterTestCase(unittest.TestCase):
    def test_query_raster(self):
        with rasterio.open("./fixtures/multiband_raster.tif"):
            for x in [0, 4, 8, 15]:
                for y in [0, 6, 6, 12]:
                    q = query_raster_at_point("./fixtures/multiband_raster.tif", x, y)
                    self.assertEqual(len(q), 4)
                    self.assertTrue(all(isinstance(v, float) for v in q.values()))


if __name__ == "__main__":
    unittest.main()
