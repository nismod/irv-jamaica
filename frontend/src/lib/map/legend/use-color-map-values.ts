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
  const query = {
    colormap: colorScheme,
    stretch_range: `[${stretchRange}]`,
  };

  const {
    isLoading,
    error,
    data = {},
  } = useQuery({
    queryKey: ['/raster/colormap', query],
    queryFn: fetchColorMapValues,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
  const { colormap = [] } = data;

  const result = useMemo(
    () =>
      colormap?.map(({ value, rgba: [r, g, b] }) => ({
        value,
        color: `rgb(${r},${g},${b})`,
      })),
    [colormap],
  );

  return {
    loading: isLoading,
    error,
    colorMapValues: result,
  };
}
