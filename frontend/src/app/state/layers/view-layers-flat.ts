import { selector } from 'recoil';

import { flattenConfig } from 'lib/nested-config/flatten-config';
import { ViewLayer } from 'lib/data-map/view-layers';

import { viewLayerConfigs } from './view-layers';

export const viewLayersFlatState = selector<ViewLayer[]>({
  key: 'viewLayersFlatState',
  get: ({ get }) => flattenConfig(get(viewLayerConfigs)),
});
