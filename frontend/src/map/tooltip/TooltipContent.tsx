import { Box, Paper } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { layerHoverStates } from 'state/interactions/interaction-state';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { RasterTarget, VectorTarget } from 'lib/data-map/types';
import { ViewLayer } from 'lib/data-map/view-layers';

const TooltipSection = ({ children }) => (
  <Box p={1} borderBottom="1px solid #ccc">
    {children}
  </Box>
);

function renderTooltip({
  key,
  target,
  viewLayer,
  Component,
}: {
  key?: string;
  target: VectorTarget | RasterTarget;
  viewLayer: ViewLayer;
  Component: FC<{ target: VectorTarget | RasterTarget; viewLayer: ViewLayer }>;
}) {
  // renderTooltip isn't implemented on all view layers yet.
  if (viewLayer.renderTooltip) {
    return viewLayer.renderTooltip({ key, target, viewLayer });
  }
  // Fallback to the default tooltip component for older layers.
  return <Component key={key} target={target} viewLayer={viewLayer} />;
}

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
            const { isHovered, hoverTarget, Component } = layerState;
            if (isHovered) {
              if (Array.isArray(hoverTarget)) {
                return (
                  <TooltipSection key={type}>
                    {hoverTarget.map(({ target, viewLayer }) =>
                      renderTooltip({ key: viewLayer.id, target, viewLayer, Component }),
                    )}
                  </TooltipSection>
                );
              }
              const { target, viewLayer } = hoverTarget;
              return (
                <TooltipSection key={type}>
                  {renderTooltip({ target, viewLayer, Component })}
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
