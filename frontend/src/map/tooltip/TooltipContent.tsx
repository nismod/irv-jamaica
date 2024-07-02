import { Box, Paper } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { layerHoverStates } from 'state/interactions/interaction-state';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';

const TooltipSection = ({ children }) => (
  <Box p={1} borderBottom="1px solid #ccc">
    {children}
  </Box>
);

export const TooltipContent: FC = () => {
  const layerStates = useRecoilValue(layerHoverStates);
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
