import { Box, Paper } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { VectorHoverDescription } from './content/VectorHoverDescription';
import { RasterHoverDescription } from './content/RasterHoverDescription';
import { RegionHoverDescription } from './content/RegionHoverDescription';
import { layerHoverStates } from 'state/interactions/interaction-state';
import { InteractionTarget, VectorTarget, RasterTarget } from 'state/interactions/use-interactions';
import { SolutionHoverDescription } from './content/SolutionHoverDescription';
import { DroughtHoverDescription } from './content/DroughtHoverDescription';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

type MapDataLayer = InteractionTarget<VectorTarget | RasterTarget>;

const TooltipSection = ({ children }) => (
  <Box p={1} borderBottom="1px solid #ccc">
    {children}
  </Box>
);


const tooltipLayers: Map<string, FC<{ hoveredObject: MapDataLayer }>> = new Map<
  string,
  FC<{ hoveredObject: MapDataLayer }>
>([
  ['assets', VectorHoverDescription],
  ['hazards', RasterHoverDescription],
  ['regions', RegionHoverDescription],
  ['solutions', SolutionHoverDescription],
  ['drought', DroughtHoverDescription],
]);
const layerEntries = [...tooltipLayers.entries()];

export const TooltipContent: FC = () => {
  const layerStates = useRecoilValue(layerHoverStates);

  const doShow = [...layerStates.values()].some(({ isHovered }) => isHovered);

  if (!doShow) return null;

  return (
    <Paper>
      <Box minWidth={200}>
        <ErrorBoundary message="There was a problem displaying the tooltip.">
          {layerEntries.map(([type, Component]) => {
            const { isHovered, target } = layerStates.get(type);
            if (isHovered) {
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
