import { Box, Paper } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { VectorHoverDescription } from './content/VectorHoverDescription';
import { RasterHoverDescription } from './content/RasterHoverDescription';
import { RegionHoverDescription } from './content/RegionHoverDescription';
import { hasHover, hoverState } from 'lib/data-map/interactions/interaction-state';
import {
  InteractionTarget,
  VectorTarget,
  RasterTarget,
} from 'lib/data-map/interactions/use-interactions';
import { showPopulationState } from 'state/regions';
import { SolutionHoverDescription } from './content/SolutionHoverDescription';
import { DroughtHoverDescription } from './content/DroughtHoverDescription';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

type MapDataLayer = InteractionTarget<VectorTarget | RasterTarget>;
type TooltipLayer = {
  component: FC<{ hoveredObject: MapDataLayer }>;
  target: MapDataLayer | MapDataLayer[] | null;
};

const TooltipSection = ({ children }) => (
  <Box p={1} borderBottom="1px solid #ccc">
    {children}
  </Box>
);

const useLayerTarget = (layerId: string) => useRecoilValue(hoverState(layerId));
/**
 * Define tooltip properties for data layers.
 * @returns a map of tooltip components and their respective data layers, mapped by layer ID.
 */
function useTooltipLayers(): Map<string, TooltipLayer> {
  return new Map<string, TooltipLayer>([
    [
      'assets',
      {
        component: VectorHoverDescription,
        target: useLayerTarget('assets'),
      },
    ],
    [
      'hazards',
      {
        component: RasterHoverDescription,
        target: useLayerTarget('hazards'),
      },
    ],
    [
      'regions',
      {
        component: RegionHoverDescription,
        target: useLayerTarget('regions'),
      },
    ],
    [
      'solutions',
      {
        component: SolutionHoverDescription,
        target: useLayerTarget('solutions'),
      },
    ],
    [
      'drought',
      {
        component: DroughtHoverDescription,
        target: useLayerTarget('drought'),
      },
    ],
  ]);
}

export const TooltipContent: FC = () => {
  const layers = useTooltipLayers();
  const layerEntries = [...layers.entries()];
  const regionDataShown = useRecoilValue(showPopulationState);

  function hasHovered([type, { target }]) {
    if (type === 'regions' && !regionDataShown) {
      return false;
    }
    return hasHover(target);
  }

  const doShow = layerEntries.some(hasHovered);

  if (!doShow) return null;

  return (
    <Paper>
      <Box minWidth={200}>
        <ErrorBoundary message="There was a problem displaying the tooltip.">
          {layerEntries.map((layer) => {
            const [type, { component: Component, target }] = layer;
            if (hasHovered(layer)) {
              if (Array.isArray(target)) {
                return (
                  <TooltipSection key={type}>
                    {target.map((hr) => (
                      <Component hoveredObject={hr} key={hr.viewLayer.id} />
                    ))}
                  </TooltipSection>
                );
              }
              return (
                <TooltipSection key={type}>
                  <Component hoveredObject={target} />
                </TooltipSection>
              );
            }
            return null;
          })}
        </ErrorBoundary>
      </Box>
    </Paper>
  );
};
