import React, { useCallback, useMemo, useState } from 'react';
import { Drawer, Toolbar } from '@material-ui/core';
import MapGL, { MapEvent, Marker } from 'react-map-gl';
import { MapboxGeoJSONFeature } from 'mapbox-gl';

import FeatureSidebar from './FeatureSidebar';
import MapTooltip from './map/MapTooltip';
import { MapParams, useMapContent } from './map/use-map-content';
import BackgroundControl from './controls/BackgroundControl';
import NetworkControl from './controls/NetworkControl';
import { useLayerSelection } from './controls/use-layer-selection';
import { ViewName, views } from './config/views';
import { LayerName, layers } from './config/layers';

const viewportLimits = {
  minZoom: 3,
  maxZoom: 16,
  maxPitch: 0,
};

const MAPBOX_KEY = 'pk.eyJ1IjoidG9tcnVzc2VsbCIsImEiOiJjaXZpMTFpdGkwMDQ1MnptcTh4ZzRzeXNsIn0.ZSvSOHSsWBQ44QNhA71M6Q';

export const MapView = () => {
  const [viewport, setViewport] = useState({
    latitude: 18.14,
    longitude: -77.28,
    zoom: 8,
  });

  const [background, setBackground] = useState<'satellite' | 'light'>('light');

  const [hoveredFeatures, setHoveredFeatures] = useState<MapboxGeoJSONFeature[]>([]);
  const [hoverPosition, setHoverPosition] = useState(null);
  const handleMapHover = useCallback((e: MapEvent) => {
    setHoveredFeatures(e.features ?? []);
    if (e.features?.length) {
      const [longitude, latitude] = e.lngLat;
      setHoverPosition({ longitude, latitude });
    }
  }, []);

  const [selectedFeatures, setSelectedFeatures] = useState<MapboxGeoJSONFeature[]>([]);
  const handleMapClick = useCallback((e: MapEvent) => {
    setSelectedFeatures(e.features ?? []);
  }, []);

  const [view] = useState<ViewName>('overview');

  const viewLayerNames = useMemo<LayerName[]>(() => views[view].layers as LayerName[], [view]);
  const layerDefinitions = useMemo(
    () => viewLayerNames.map((layerName) => ({ ...layers[layerName], key: layerName })),
    [viewLayerNames],
  );

  const { layerSelection, updateLayerSelection } = useLayerSelection(viewLayerNames);

  const mapContentParams = useMemo<MapParams>(
    () => ({ background, view, dataLayerSelection: layerSelection }),
    [background, view, layerSelection],
  );
  const mapContent = useMapContent(mapContentParams);

  return (
    <>
      <Drawer variant="permanent">
        <Toolbar /> {/* Prevents app bar from concealing content*/}
        <div className="drawer-contents">
          <NetworkControl
            dataLayers={layerDefinitions}
            layerVisibility={layerSelection}
            onLayerVisChange={updateLayerSelection}
          />
          <BackgroundControl background={background} onBackgroundChange={setBackground} />
        </div>
      </Drawer>
      <div className="map-height">
        <MapGL
          mapboxApiAccessToken={MAPBOX_KEY}
          width="100%"
          height="100%"
          {...viewport}
          onViewportChange={setViewport}
          {...viewportLimits}
          dragRotate={false}
          touchRotate={false}
          onHover={handleMapHover}
          onClick={handleMapClick}
          mapStyle={mapContent}
          reuseMaps={true}
        >
          {hoveredFeatures.length !== 0 && (
            <Marker {...hoverPosition} offsetLeft={-150}>
              <MapTooltip features={hoveredFeatures} />
            </Marker>
          )}
        </MapGL>
        {selectedFeatures.length !== 0 && <FeatureSidebar feature={selectedFeatures[0]} />}
      </div>
    </>
  );
};
