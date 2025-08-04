PGDATABASE=jamaicadev PGUSER=docker PGPASSWORD=docker PGHOST=localhost PGPORT=25432 \
    snakemake -c1 \
    ../tileserver/vector/data/road_edges_motorway.mbtiles \
    ../tileserver/vector/data/road_edges_class_a.mbtiles \
    ../tileserver/vector/data/road_edges_class_b.mbtiles \
    ../tileserver/vector/data/road_edges_class_c.mbtiles \
    ../tileserver/vector/data/road_edges_residential.mbtiles \
    ../tileserver/vector/data/road_edges_unclassified.mbtiles \
    ../tileserver/vector/data/road_bridges.mbtiles \
    ../tileserver/vector/data/road_junctions.mbtiles
