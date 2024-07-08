import { FC } from 'react';

import { ViewLayer } from 'lib/data-map/view-layers';
import { useRecoilValue } from 'recoil';
import { viewLayersFlatState } from 'state/layers/view-layers-flat';
import { Stack, Box, Paper, Divider } from '@mui/material';
import { MobileTabContentWatcher } from 'pages/map/layouts/mobile/tab-has-content';

export const MapLegend: FC = () => {
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
        /**
         * Construct a key for grouping legends of the same type,
         * to avoid displaying the same legend many times for multiple layers.
         * Currently this is based on fieldGroup-field pair,
         * but this could need reworking for future cases.
         */
        const colorMapKey = `${colorMap.fieldSpec.fieldGroup}-${colorMap.fieldSpec.field}`;

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
