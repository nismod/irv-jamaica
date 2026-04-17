# Extract-transform-load

This workflow follows on from the final steps of the `jamaica-infrastructure` analysis workflow,
in particular those [rules which "prepare for visualisation"](https://github.com/nismod/jamaica-infrastructure/blob/development/workflow/7_etl/_etl.smk)

In summary:
- hazard data is input as a set of raster files, output as Cloud-Optimised Geotiffs (for map visualisation, one layer at a time)
  and Zarr datasets (for point query, all layers at a single location)
- infrastructure feature layers are input as parquet files from the end of `jamaica-infrastructure`
  and loaded into a Postgres database (containing the features and full risk/adaptation results)
  and also processed into .mbtiles files (containing the features as vector tiles for map visualisation).

Before and after running this workflow against a staging or live server, it is recommended to backup and archive 
the database and updated files. Here's a script: [`archive-data.sh`](../../archive-data.sh)

Coordinate with system administrators on the best way to access development, staging, and production
servers, for example through University of Oxford, University of the West Indies, or National
Spatial Data Management Branch (NSDMB). No contact information or further details should be 
recorded in this public repository.

There are three categories of data that go in roughly three corresponding
places:

## 1. Features

These are all of the vector layers of infrastructure networks with their
geometries and attributes.

The data files (GeoPackages, some with multiple layers) are listed in
`network_layers.csv`

These are transformed into tilelayers for visualisation on the site, as listed
in `network_tilelayers.csv`

One data layer (e.g. transport_roads_edges) may become one or more tilelayers
(e.g. road_edges_class_a, road_edges_class_b, road_edges_class_c,
road_edges_track, road_edges_metro, road_edges_other).

Feature layers are first loaded into the database, then dumped as line-delimited
GeoJSON, then converted into MBTiles files (these are SQLite database files
containing Mapbox Vector Tiles). 

These MBTiles are then referenced by the vector tileserver `config.json` to
make them accessible in the web application.

## 2. Damages and adaptation results

These are all in parquet files, relating to damage and loss calculations on the
infrastructure feature layers. 

These data are loaded into the database, into each of the corresponding tables, 
in general with a transformation from "fat" (many columns for each of the 
hazard RP/RCP/epoch/... combinations) to "long" or "tidy" (many rows, with RP, 
RCP, epoch, ... columns serving as a multi-column index) table format.

## 3. Hazard rasters

Hazard maps are stored as 2D raster data in GeoTIFFs for analysis. These are
each converted to Cloud-Optimised GeoTIFF format. We also set zero values to
nodata (which is something of a judgement call - nodata values will be
visualised as transparent, which is desirable in the case of flood or wind speed
return period maps).

The files are named on a strict template, which allows the terracotta server to
address each layer with a combination of parameters:
`{hazard_type}__rp_{rp}__rcp_{rcp}__epoch_{epoch}__conf_{confidence}.tif`

### Raster ingestion

There is a following step, not in the Snakefile, to ingest all the prepared
rasters into a metadata database. This includes the absolute path to the file,
so is best to run either within a container (with data mounted to the same path
whether the container is runnin in development or production) or once per host
machine, with the full path changed from `/data` as required:

```
terracotta ingest "/data/{type}__rp_{rp}__rcp_{rcp}__epoch_{epoch}__conf_{confidence}.tif" -o /data/terracotta.sqlite
```

## 4. Other

There are a couple of other vector layers that provide supporting information,
and are converted to MBTiles, for example regions and nature-based solutions.


## Requirements

- Postgres database, potentially running in a local container for development
  - schema defined in `../backend/backend/db/models.py`
- Python, snakemake and other packages
  - requirements in `../backend/Pipfile`
- [`jq`](https://stedolan.github.io/jq/)
- [`geojson-polygon-labels`](https://github.com/andrewharvey/geojson-polygon-labels)
- [`tippecanoe`](https://github.com/mapbox/tippecanoe)


### GDAL tools

[ogr2ogr](https://www.gdal.org/ogr2ogr.html) and other GDAL programs are used
for spatial data processing. On Ubuntu, run:

    sudo apt-get install gdal-bin


### Tippecanoe

The data preparation steps use
[Mapbox tippecanoe](https://github.com/mapbox/tippecanoe) to build vector tiles
from large feature sets.

The easiest way to install tippecanoe on OSX is with Homebrew:

    brew install tippecanoe

On Ubuntu it will usually be easiest to build from the source repository:

    sudo apt-get install build-essential g++ libsqlite3-dev zlib1g-dev
    git clone https://github.com/mapbox/tippecanoe
    cd tippecanoe
    make -j
    make
