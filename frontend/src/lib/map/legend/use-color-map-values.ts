import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

async function fetchColorMapValues({ queryKey }) {
  const [endpoint, query] = queryKey;
  const searchParams = new URLSearchParams(query);
  const response = await fetch(`${endpoint}?${searchParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch color map values');
  }
  return response.json();
}

export function useRasterColorMapValues(colorScheme: string, stretchRange: [number, number]) {
  const [rangeMin, rangeMax] = stretchRange;
  const query = {
    colormap: colorScheme,
    stretch_range: '[0,1]',
  }

  const {
    isLoading,
    error,
    data = {},
  } = useQuery({
    queryKey: ['/raster/colormap', query],
    queryFn: fetchColorMapValues,
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
