import csv

csv_fields = [
    'hazard', 'path', 'rp', 'rcp', 'epoch', 'confidence',
    'variable', 'unit', 'key'
]
storm_speeds = [
    20, 25, 29, 30, 35, 37, 40, 43, 45, 50, 51, 55, 60, 61, 65, 70
]
with open('storm_layers.csv', 'w', newline='') as csvfile:
    writer = csv.DictWriter(csvfile, fieldnames=csv_fields)
    writer.writeheader()
    for speed in storm_speeds:
        rp = 0
        rcp = 8.5
        rcp_str = '8x5'
        epoch = 2050
        conf = 'None'
        path = (
            'STORM_RP_rasters/'
            f'STORM_FIXED_WIND_SPEEDS_2050_RCP8.5_NA_{speed}_MS.tif'
        )
        key = (
            f'storm{speed}__rp_{rp}__rcp_{rcp_str}__epoch_{epoch}__conf_{conf}'
        )
        writer.writerow({
            'hazard': 'storm',
            'path': path,
            'rp': rp,
            'rcp': rcp,
            'epoch': epoch,
            'confidence': conf,
            'variable': 'Return period',
            'unit': 'years',
            'key': key
        })
        rp = 0
        rcp = 2.6
        rcp_str = '2x6'
        epoch = 2010
        path = (
            'STORM_RP_rasters/'
            f'STORM_FIXED_WIND_SPEEDS_constant_NA_{speed}_MS.tif'
        )
        key = (
            f'storm{speed}__rp_{rp}__rcp_{rcp_str}__epoch_{epoch}__conf_{conf}'
        )
        writer.writerow({
            'hazard': 'storm',
            'path': path,
            'rp': rp,
            'rcp': rcp,
            'epoch': epoch,
            'confidence': conf,
            'variable': 'Return period',
            'unit': 'years',
            'key': key
        })
