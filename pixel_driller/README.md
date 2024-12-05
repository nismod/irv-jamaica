# Prototyping pixel query endpoint

Run tests:

```bash
pushd tests/fixtures
python make_fixtures.py
popd

python -m unittest tests/test_*.py
```

Run ingest:

```bash
mkdir -p ../tileserver/stacks
python ingest.py /path/to/jamaica-infrastructure/processed_data/ ../tileserver/stacks
```

Backup to tar:

```bash
tar cvf 2024-12-05_jamaica.infrastructureresilience.org_tileserver_stacks.tar tileserver/stacks
```

Run service:

```bash
docker compose -f docker-compose.dev.yml up pixel-driller
```

```bash
curl http://localhost:5080/-78.0/18.5
```

Run the whole app:

```bash
docker compose -f docker-compose.dev.yml up
```

```bash
curl http://localhost/pixel/-78.0/18.5
```
