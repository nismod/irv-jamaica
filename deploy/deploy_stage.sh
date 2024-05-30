#!/usr/bin/env bash
set -e
set -x

#
# Deploy app data
# - assumes that SSH config is set up to connect to host "jamaica"
#
host="jamaica"
BASEDIR=$(dirname $0)

pushd $BASEDIR/..

echo "Running in ${pwd}"

# # vector data
# rsync -ravz tileserver/vector/data/ $host:/var/www/tileserver/vector/data
# rsync -ravz tileserver/vector/fonts/ $host:/var/www/tileserver/vector/fonts
# rsync -ravz tileserver/vector/config.json $host:/var/www/tileserver/vector

# # raster data
# rsync -ravz tileserver/raster/data/ $host:/var/www/tileserver/raster/data
# rsync -ravz tileserver/raster/config.toml $host:/var/www/tileserver/raster

# docker compose configuration
rsync -avz docker-compose.stage.yml $host:/var/www/
rsync -avz envs/stage/ $host:/var/www/envs

popd
