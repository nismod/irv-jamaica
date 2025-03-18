import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchColorMapValues(colorScheme: string) {
  const response = await fetch(`/raster/colormap?colormap=${colorScheme}&stretch_range=[0,1]`);
  if (!response.ok) {
    throw new Error('Failed to fetch color map values');
  }
  return response.json();
}

export function useRasterColorMapValues(colorScheme: string, stretchRange: [number, number]) {
  const [rangeMin, rangeMax] = stretchRange;

  const {
    isLoading,
    error,
    data = {},
  } = useQuery({
    queryKey: ['colormaps', colorScheme],
    queryFn: () => fetchColorMapValues(colorScheme),
  });
  const { colormap = [] } = data;

  const rangeSize = rangeMax - rangeMin;

  const result = useMemo(
    () =>
      colormap?.map(({ value, rgba: [r, g, b] }) => ({
        value: rangeMin + value * rangeSize,
        color: `rgb(${r},${g},${b})`,
      })),
    [colormap, rangeMin, rangeSize],
  );

  return {
    loading: isLoading,
    error,
    colorMapValues: result,
  };
}
