import { Box, Paper } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { tooltipLayers } from 'config/interaction-groups';
import { layerHoverStates } from 'state/interactions/interaction-state';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

const TooltipSection = ({ children }) => (
  <Box p={1} borderBottom="1px solid #ccc">
    {children}
  </Box>
);

const layerEntries = [...tooltipLayers.entries()];

export const TooltipContent: FC = () => {
  const layerStates = useRecoilValue(layerHoverStates);

  const doShow = [...layerStates.values()].some((layerState) => layerState.isHovered);

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
