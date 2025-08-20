# API backend

Server app, written in Python, includes database definition and etl.

`Dockerfile` defines docker container build. From the root of this repository, run:

```bash
docker compose -f docker-compose.prod.yml build backend
```

Outline of dependencies:
- `python` and `pip` (e.g. `apt install python3 python3-pip` on Ubuntu, or use
  `venv` or a conda environment locally)
- `pyproject.toml` defines:
  - `backend` package for this application
  - further python package dependencies
- system library dependencies of python packages (if installing locally) include
  `libgdal-dev libgeos-dev libpq-dev libproj-dev`

Running directly:
- `pip install -e .` installs the `backend` package and its dependencies
- `python -m uvicorn backend.app.main:app --host localhost --port 8888`
  runs the API server

Environment variables:
- use [`PG*`](https://www.postgresql.org/docs/current/libpq-envars.html) to
  define database connection details. See `.env.example` for an example
