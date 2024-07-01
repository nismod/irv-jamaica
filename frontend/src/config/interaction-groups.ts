import { InteractionGroupConfig } from 'lib/data-map/types';

import { AssetHoverDescription } from './assets/AssetHoverDescription';
import { HazardHoverDescription } from './hazards/HazardHoverDescription';
import { SolutionHoverDescription } from './solutions/SolutionHoverDescription';
import { RegionHoverDescription } from './regions/RegionHoverDescription';
import { DroughtHoverDescription } from './drought/DroughtHoverDescription';

export const INTERACTION_GROUPS = new Map<string, InteractionGroupConfig>([
  [
    'assets',
    {
      id: 'assets',
      type: 'vector',
      pickingRadius: 8,
      pickMultiple: false,
      usesAutoHighlight: true,
      Component: AssetHoverDescription,
    },
  ],
  [
    'hazards',
    {
      id: 'hazards',
      type: 'raster',
      pickMultiple: true,
      Component: HazardHoverDescription,
    },
  ],
  [
    'regions',
    {
      id: 'regions',
      type: 'vector',
      pickingRadius: 8,
      pickMultiple: false,
      Component: RegionHoverDescription,
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
      Component: SolutionHoverDescription,
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
      Component: DroughtHoverDescription,
    },
  ],
]);
