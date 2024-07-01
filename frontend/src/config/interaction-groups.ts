import { FC } from 'react';
import {
  InteractionGroupConfig,
  InteractionTarget,
  VectorTarget,
  RasterTarget,
} from 'state/interactions/use-interactions';

import { HazardHoverDescription } from './hazards/HazardHoverDescription';

import { VectorHoverDescription } from 'map/tooltip/content/VectorHoverDescription';
import { RegionHoverDescription } from 'map/tooltip/content/RegionHoverDescription';
import { SolutionHoverDescription } from 'map/tooltip/content/SolutionHoverDescription';
import { DroughtHoverDescription } from 'map/tooltip/content/DroughtHoverDescription';

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

type MapDataLayer = InteractionTarget<VectorTarget | RasterTarget>;

export const tooltipLayers: Map<string, FC<{ hoveredObject: MapDataLayer }>> = new Map<
  string,
  FC<{ hoveredObject: MapDataLayer }>
>([
  ['assets', VectorHoverDescription],
  ['hazards', HazardHoverDescription],
  ['regions', RegionHoverDescription],
  ['solutions', SolutionHoverDescription],
  ['drought', DroughtHoverDescription],
]);
