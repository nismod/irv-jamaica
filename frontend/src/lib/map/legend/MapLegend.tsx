import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { Stack, Box, Paper, Divider } from '@mui/material';

import { ViewLayer } from 'lib/data-map/view-layers';
import { viewLayersFlatState } from 'lib/state/layers/view-layers';
import { MobileTabContentWatcher } from 'lib/map/layouts/tab-has-content';

interface MapLegendProps {
  currentHazard?: string;
}

export const MapLegend: FC<MapLegendProps> = ({ currentHazard }) => {
  const viewLayers = useRecoilValue(viewLayersFlatState);

  const rasterViewLayers = [];

  const dataColorMaps: Record<string, ViewLayer> = {};

  viewLayers.forEach((viewLayer) => {
    if (viewLayer.spatialType === 'raster') {
      rasterViewLayers.push(viewLayer);
    } else {
      /**
       * get style params from the style params set directly in the new layer
       * (new mechanism used for styleParams by assets, NBS, drought, population etc)
       */
      const { colorMap } = viewLayer.styleParams ?? {};

      if (colorMap) {
        // Skip damage legends that don't match the current hazard selection
        if (colorMap.fieldSpec.fieldGroup === 'damages_expected') {
          const layerHazard = colorMap.fieldSpec.fieldDimensions?.hazard;
          if (layerHazard && layerHazard !== currentHazard) {
            return;
          }
        }

        let colorMapKey = `${colorMap.fieldSpec.fieldGroup}-${colorMap.fieldSpec.field}`;
        /**
         * Construct a key for grouping legends of the same type,
         * to avoid displaying the same legend many times for multiple layers.
         */

        // Include hazard type in the key to distinguish between different hazards
        if (colorMap.fieldSpec.fieldDimensions?.hazard) {
          colorMapKey = `${colorMapKey}-${colorMap.fieldSpec.fieldDimensions.hazard}`;
        }

        // Include range to distinguish between different damage scales (coastal vs regular)
        const rangeKey = `${colorMap.colorSpec.range[0]}-${colorMap.colorSpec.range[1]}`;
        colorMapKey = `${colorMapKey}-${rangeKey}`;

        // save the colorMap and formatConfig for first layer of each group
        if (dataColorMaps[colorMapKey] == null) {
          dataColorMaps[colorMapKey] = viewLayer;
        }
      }
    }
  });
  const layersToShow = [...rasterViewLayers, ...Object.values(dataColorMaps)];

  return rasterViewLayers.length || Object.keys(dataColorMaps).length ? (
    <Paper>
      <MobileTabContentWatcher tabId="legend" />
      <Box p={1} maxWidth={270}>
        <Stack gap={0.3} divider={<Divider />}>
          {layersToShow.map((viewLayer) => viewLayer.renderLegend())}
        </Stack>
      </Box>
    </Paper>
  ) : null;
};
