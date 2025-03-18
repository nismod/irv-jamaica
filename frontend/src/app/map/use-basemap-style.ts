import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import { StyleSpecification } from 'maplibre-gl';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  BACKGROUNDS,
  BACKGROUND_ATTRIBUTIONS,
  BASEMAP_STYLE_URL,
  BackgroundName,
  BackgroundSpecification,
  LABELS_LAYERS,
} from 'app/config/basemaps';

function visible(isVisible: boolean): 'visible' | 'none' {
  return isVisible ? 'visible' : 'none';
}

async function fetchBasemapStyle() {
  const response = await fetch(BASEMAP_STYLE_URL);

  if (!response.ok) throw new Error('Failed to fetch basemap style');

  return response.json();
}

function makeBasemapStyle(
  baseStyle: StyleSpecification,
  backgroundConfig: BackgroundSpecification,
  showLabels: boolean,
): StyleSpecification {
  const backgroundLayersLookup = new Set(backgroundConfig.layers);
  const labelLayersLookup = new Set(LABELS_LAYERS);

  const style = cloneDeep(baseStyle);

  for (const layer of style.layers) {
    const { id } = layer;

    const isVisible = backgroundLayersLookup.has(id) || (showLabels && labelLayersLookup.has(id));
    set(layer, 'layout.visibility', visible(isVisible));
  }

  return style;
}

export function useBasemapStyle(
  background: BackgroundName,
  showLabels: boolean,
): { mapStyle: StyleSpecification; firstLabelId: string | undefined } {
  const backgroundConfig = BACKGROUNDS[background];
  const {
    data: baseStyle = {
      version: 8,
      sources: {},
      layers: [],
    },
  } = useQuery({
    queryKey: ['basemapStyle'],
    queryFn: fetchBasemapStyle,
  });

  const mapStyle = useMemo(
    () => makeBasemapStyle(baseStyle, backgroundConfig, showLabels),
    [baseStyle, backgroundConfig, showLabels],
  );

  const firstLabelId = showLabels ? LABELS_LAYERS[0] : undefined;

  return {
    mapStyle,
    firstLabelId,
  };
}

export function useBackgroundAttribution(background: BackgroundName) {
  return BACKGROUND_ATTRIBUTIONS[background];
}
