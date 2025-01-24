import { Suspense, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { DataMapTooltip } from 'lib/data-map/DataMapTooltip';
import { MapBoundsFitter, mapFitBoundsState } from 'lib/map/MapBoundsFitter';
import { MapHud } from 'lib/map/hud/MapHud';
import { MapHudRegion } from 'lib/map/hud/MapHudRegion';
import {
  MapHudAttributionControl,
  MapHudNavigationControl,
  MapHudScaleControl,
} from 'lib/map/hud/map-controls';
import { MapSearch } from 'lib/map/place-search/MapSearch';
import { PlaceSearchResult } from 'lib/map/place-search/use-place-search';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { withProps } from 'lib/react/with-props';
import { MapLegend } from 'lib/map/legend/MapLegend';
import { TooltipContent } from 'lib/map/tooltip/TooltipContent';

import { globalStyleVariables } from 'app/theme';
import { useIsMobile } from 'app/use-is-mobile';
import { layerHoverStates } from 'app/state/interactions/interaction-state';

import { MapLayerSelection } from './layers/MapLayerSelection';
import { BaseMapContainer } from './BaseMap';
import { DataMapContainer } from './DataMap';

const AppPlaceSearch = () => {
  const setFitBounds = useSetRecoilState(mapFitBoundsState);

  const handleSelectedSearchResult = useCallback(
    (result: PlaceSearchResult) => {
      setFitBounds(result.boundingBox);
    },
    [setFitBounds],
  );

  return <MapSearch onSelectedResult={handleSelectedSearchResult} />;
};

const AppNavigationControl = withProps(MapHudNavigationControl, {
  showCompass: false,
  capturePointerMove: true,
});

const AppScaleControl = withProps(MapHudScaleControl, {
  maxWidth: 100,
  unit: 'metric',
  capturePointerMove: true,
});

const AppAttributionControl = withProps(MapHudAttributionControl, {
  customAttribution:
    'Background map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, style &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>. Satellite imagery: <a href="https://s2maps.eu" target="_blank" rel="noopener noreferrer">Sentinel-2 cloudless - https://s2maps.eu</a> by <a href="https://eox.at" target="_blank" rel="noopener noreferrer">EOX IT Services GmbH</a> (Contains modified Copernicus Sentinel data 2020)',
  compact: true,
  capturePointerMove: true,
});

const MapHudDesktopLayout = () => {
  return (
    <MapHud left={globalStyleVariables.controlSidebarWidth}>
      <MapHudRegion position="top-left" StackProps={{ spacing: 1 }}>
        <AppPlaceSearch />
        <MapLayerSelection />
      </MapHudRegion>
      <MapHudRegion position="top-right">
        <AppNavigationControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-right">
        {/* <ViewStateDebug /> */}
        <AppScaleControl />
        <AppAttributionControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-left">
        <MapLegend />
      </MapHudRegion>
    </MapHud>
  );
};

const MapHudMobileLayout = () => {
  return (
    <MapHud bottom={120}>
      <MapHudRegion position="top-left" StackProps={{ spacing: 1 }}>
        <AppPlaceSearch />
        <MapLayerSelection />
      </MapHudRegion>
      <MapHudRegion position="top-right">
        <AppNavigationControl />
      </MapHudRegion>
      <MapHudRegion position="bottom-right">
        <AppScaleControl />
        <AppAttributionControl />
      </MapHudRegion>
    </MapHud>
  );
};

const DataMapTooltipContent = () => {
  const layerStates = useRecoilValue(layerHoverStates);
  return <TooltipContent layerStates={layerStates} />;
};

const MapViewContent = () => {
  const isMobile = useIsMobile();

  return (
    <BaseMapContainer>
      <DataMapContainer />
      <MapBoundsFitter />
      <DataMapTooltip>
        <DataMapTooltipContent />
      </DataMapTooltip>
      {isMobile ? <MapHudMobileLayout /> : <MapHudDesktopLayout />}
    </BaseMapContainer>
  );
};

export const MapView = () => (
  <ErrorBoundary message="There was a problem displaying the map." justifyErrorContent="center">
    <Suspense fallback={null}>
      <MapViewContent />
    </Suspense>
  </ErrorBoundary>
);
