import { Box, Typography } from '@mui/material';
import { FC, ReactNode, memo } from 'react';

import { ColorValue } from './RasterLegend';

const legendHeight = 10;

const LegendGradient: FC<{
  colorMapValues: ColorValue[];
  getValueLabel: (value: number) => string;
}> = ({ colorMapValues, getValueLabel }) => {
  return (
    <>
      {colorMapValues.map(({ color, value }, i) => (
        <Box key={i} height={legendHeight} width={1} bgcolor={color} title={getValueLabel(value)} />
      ))}
    </>
  );
};

export interface GradientLegendProps {
  label: string | ReactNode;
  description?: string;
  range: [number, number];
  colorMapValues: ColorValue[];
  getValueLabel: (value: number) => string;
}

export const GradientLegendComponent: FC<GradientLegendProps> = ({
  label,
  range,
  colorMapValues,
  getValueLabel,
}) => (
  <Box mb={2}>
    <Typography>{label}</Typography>
    <Box
      height={legendHeight + 2}
      width={255}
      bgcolor="#ccc"
      display="flex"
      flexDirection="row"
      border="1px solid gray"
    >
      {colorMapValues && (
        <LegendGradient colorMapValues={colorMapValues} getValueLabel={getValueLabel} />
      )}
    </Box>
    <Box height={10} position="relative">
      {colorMapValues && (
        <>
          <Box position="absolute" left={0}>
            <Typography>{getValueLabel(range[0])}</Typography>
          </Box>
          <Box position="absolute" right={0}>
            <Typography>{getValueLabel(range[1])}</Typography>
          </Box>
        </>
      )}
    </Box>
  </Box>
);

export const GradientLegend = memo(GradientLegendComponent);
