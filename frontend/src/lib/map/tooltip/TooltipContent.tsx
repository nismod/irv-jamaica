import { Box, Paper } from '@mui/material';
import { FC } from 'react';

import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { InteractionLayer } from 'lib/data-map/types';

const TooltipSection = ({ children }) => (
  <Box p={1} borderBottom="1px solid #ccc">
    {children}
  </Box>
);

type LayerHoverState = {
  isHovered: boolean;
  hoverTarget: InteractionLayer | InteractionLayer[];
};

export const TooltipContent: FC<{ layerStates: Map<string, LayerHoverState> }> = ({
  layerStates,
}) => {
  const layerStateEntries = [...layerStates.entries()];

  const doShow = [...layerStates.values()].some((layerState) => layerState.isHovered);

  if (!doShow) return null;

  return (
    <Paper>
      <Box minWidth={200}>
        <ErrorBoundary message="There was a problem displaying the tooltip.">
          {layerStateEntries.map(([type, layerState]) => {
            const { isHovered, hoverTarget } = layerState;
            if (isHovered) {
              if (Array.isArray(hoverTarget)) {
                return (
                  <TooltipSection key={type}>
                    {hoverTarget.map(({ target, viewLayer }) =>
                      viewLayer.renderTooltip({ target }),
                    )}
                  </TooltipSection>
                );
              }
              const { target, viewLayer } = hoverTarget;
              return (
                <TooltipSection key={type}>{viewLayer.renderTooltip({ target })}</TooltipSection>
              );
            }
            return null;
          })}
        </ErrorBoundary>
      </Box>
    </Paper>
  );
};
