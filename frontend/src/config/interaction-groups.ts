import { InteractionGroupConfig } from 'state/interactions/use-interactions';
import { HAZARDS_METADATA } from './hazards/metadata';

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

export const labelsMetadata = {
  ...HAZARDS_METADATA,
};
