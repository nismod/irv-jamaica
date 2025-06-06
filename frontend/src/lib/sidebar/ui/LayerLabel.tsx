import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Stack, Typography } from '@mui/material';
import { ShapeLegend, LegendShapeType } from 'lib/map-shapes/ShapeLegend';
import { useRecoilValue } from 'recoil';

import { mapViewStateState } from 'lib/state/map-view/map-view-state';

export const LayerLabel = ({
  label,
  type,
  color,
  minZoom,
  visible,
}: {
  label: string;
  type: LegendShapeType;
  color: string;
  minZoom?: number;
  visible: boolean;
}) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
      <Stack direction="row" alignItems="center">
        <ShapeLegend type={type} color={color} />
        <Typography>{label}</Typography>
      </Stack>
      {visible && minZoom != null && <ZoomVisibility minZoom={minZoom} />}
    </Stack>
  );
};

function ZoomVisibility({ minZoom }: { minZoom: number }) {
  const mapViewState = useRecoilValue(mapViewStateState);
  const currentZoom = mapViewState.zoom;

  return (
    currentZoom < minZoom && (
      <Box title="This data is only visible at higher map zoom levels">
        <VisibilityOff fontSize="small" color="disabled" />
      </Box>
    )
  );
}
