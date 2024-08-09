import { ViewLayer } from 'lib/data-map/view-layers';
import { INFRASTRUCTURE_VIEW_LAYERS } from './view-layers';

export function networkViewLayer({ network, styleParams }): ViewLayer {
  return {
    ...INFRASTRUCTURE_VIEW_LAYERS[network],
    styleParams,
  };
}
