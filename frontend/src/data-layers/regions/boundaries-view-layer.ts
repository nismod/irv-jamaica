import { createElement } from 'react';

import { VectorTarget } from 'lib/data-map/types';
import { ViewLayer } from 'lib/data-map/view-layers';

import { regionBoundariesDeckLayer } from './region-boundaries-deck-layer';
import { RegionLevel } from './metadata';
import { RegionHoverDescription } from './RegionHoverDescription';

export function regionBoundariesViewLayer(regionLevel: RegionLevel): ViewLayer {
  return {
    id: `boundaries_${regionLevel}`,
    group: 'regions',
    spatialType: 'vector',
    interactionGroup: 'regions',
    params: {
      regionLevel,
    },
    fn: () => regionBoundariesDeckLayer(regionLevel),
    renderTooltip({ target }: { target: VectorTarget }) {
      return createElement(RegionHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
