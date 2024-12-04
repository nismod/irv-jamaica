import os.path
import unittest

import rasterio

from ingest import stack


class IngestTestCase(unittest.TestCase):
    def test_ingest(self):
        out_file = "./fixtures/output/stack.tif"
        if os.path.exists(out_file):
            os.remove(out_file)
        self.assertEqual(os.path.exists(out_file), False)
        stack("./fixtures/single_band", out_file, "./fixtures/single_band/raster_ref.tif")
        self.assertEqual(os.path.exists(out_file), True)

        # Check we can open the file and it has the expected number of bands (4)
        with rasterio.open(out_file) as src:
            self.assertEqual(src.count, 4)
            self.assertIn("source", src.tags(1))


if __name__ == '__main__':
    unittest.main()
