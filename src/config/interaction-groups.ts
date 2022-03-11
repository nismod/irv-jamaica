import { InteractionGroupConfig } from 'lib/data-map/interactions/use-interactions';
import { makeConfig } from 'lib/helpers';

export const INTERACTION_GROUPS = makeConfig<InteractionGroupConfig, string>([
  {
    id: 'assets',
    type: 'vector',
    pickingRadius: 8,
    pickMultiple: false,
    usesAutoHighlight: true,
  },
  {
    id: 'hazards',
    type: 'raster',
    pickMultiple: true,
  },
  {
    id: 'regions',
    type: 'vector',
    pickingRadius: 8,
    pickMultiple: false,
  },
]);