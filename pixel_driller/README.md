# Pixel driller

This Python fastAPI service listens for requests at /{longitude}/{latitude} and
responds with the values of available raster layers at that point.

## Usage

### Ingest

Supplied rasters are ingested and saved in chunked Zarr format as a 'stack' for
rapid retrieval.

```bash
mkdir -p ../tileserver/stacks
python ingest.py /path/to/jamaica-infrastructure/processed_data/ ../tileserver/stacks
```

### Run this service only

The app is dockerised and run with compose.

```bash
docker compose -f docker-compose.dev.yml up pixel-driller
```

```bash
curl http://localhost:5080/-78.0/18.5
```

### Run the whole app

The app can also be run as part of the larger irv-jamaica risk analysis stack.

```bash
docker compose -f docker-compose.dev.yml up
```

```bash
curl http://localhost/pixel/-78.0/18.5
```

### Backup

To backup ingested stacks, run:

```bash
tar cvf $(date --iso-8601)_jamaica.infrastructureresilience.org_tileserver_stacks.tar tileserver/stacks
```

## Testing

First, create test fixtures (e.g. sample stacks):

```bash
pushd tests/fixtures
python make_fixtures.py
popd
```

To run the tests:

```bash
python -m unittest tests/test_*.py
```