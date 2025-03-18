import { useQuery } from '@tanstack/react-query';
import { useDebounceValue } from 'usehooks-ts';
import { BoundingBox, NominatimBoundingBox, nominatimToAppBoundingBox } from 'lib/bounding-box';

export interface PlaceSearchResult {
  label: string;
  latitude: number;
  longitude: number;
  boundingBox: BoundingBox;
}

interface NominatimSearchResult {
  display_name: string;
  lat: string;
  lon: string;
  boundingbox: string[];
}

function processNominatimData(data: NominatimSearchResult[]): PlaceSearchResult[] {
  return data?.map((x) => ({
    label: x.display_name,
    latitude: parseFloat(x.lat),
    longitude: parseFloat(x.lon),
    boundingBox: nominatimToAppBoundingBox(x.boundingbox.map(parseFloat) as NominatimBoundingBox),
  }));
}

async function fetchPlaces({ queryKey }) {
  const [origin, query] = queryKey;
  const searchParams = new URLSearchParams(query);
  const response = await fetch(
    `${origin}?${searchParams}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch places');
  }
  return response.json();
}

export function usePlaceSearch(searchValue: string) {
  const [debouncedSearchValue] = useDebounceValue(searchValue.trim(), 1500);
  const query = {
    countrycodes: 'jm',
    format: 'jsonv2',
    q: debouncedSearchValue,
  }

  const { data, error, isFetching } = useQuery({
    queryKey: ['https://nominatim.openstreetmap.org/search.php', query],
    queryFn: fetchPlaces,
    enabled: !!debouncedSearchValue,
    select: processNominatimData, // Transform the response
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return {
    loading: isFetching,
    error,
    searchResults: data ?? [],
  };
}
