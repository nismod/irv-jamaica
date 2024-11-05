import { InteractionGroupConfig } from 'lib/data-map/types';

export const INTERACTION_GROUPS = new Map<string, InteractionGroupConfig>([
  [
    'assets',
    {
      id: 'assets',
      type: 'vector',
      pickingRadius: 8,
      pickMultiple: false,
      usesAutoHighlight: true,
    },
  ],
  [
    'hazards',
    {
      id: 'hazards',
      type: 'raster',
      pickMultiple: true,
    },
  ],
  [
    'risks',
    {
      id: 'risks',
      type: 'raster',
      pickMultiple: false,
    },
  ],
  [
    'regions',
    {
      id: 'regions',
      type: 'vector',
      pickingRadius: 8,
      pickMultiple: false,
    },
  ],
  [
    'solutions',
    {
      id: 'solutions',
      type: 'vector',
      pickingRadius: 8,
      usesAutoHighlight: true,
      pickMultiple: false,
    },
  ],
  [
    'drought',
    {
      id: 'drought',
      type: 'vector',
      pickingRadius: 8,
      usesAutoHighlight: true,
      pickMultiple: false,
    },
  ],
]);
