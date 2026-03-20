import { useAtomValue } from 'jotai';
import { Marker } from 'react-map-gl/maplibre';

import { mapInteractionModeState } from 'lib/state/map-interaction-state';
import { pixelSelectionState } from 'lib/state/pixel-driller';

export const LocationMarker = () => {
  const interactionMode = useAtomValue(mapInteractionModeState);
  const selectedLocation = useAtomValue(pixelSelectionState);

  if (interactionMode !== 'pixel-driller' || !selectedLocation) {
    return null;
  }
  const { lat, lon } = selectedLocation;

  return (
    <Marker
      longitude={lon}
      latitude={lat}
      anchor="center"
      style={{ pointerEvents: 'none', cursor: 'default' }}
    >
      <LocationMarkerIcon />
    </Marker>
  );
};

const LocationMarkerIcon = () => {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ display: 'block', filter: 'drop-shadow(0 0 0.5px rgba(255, 255, 255, 1))' }}
    >
      {/* White outline - Top horizontal line */}{' '}
      <line x1="5" y1="20" x2="15" y2="20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      {/* White outline - Bottom horizontal line */}
      <line
        x1="25"
        y1="20"
        x2="35"
        y2="20"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* White outline - Left vertical line */}
      <line x1="20" y1="5" x2="20" y2="15" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      {/* White outline - Right vertical line */}
      <line
        x1="20"
        y1="25"
        x2="20"
        y2="35"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Red marker - Top horizontal line */}
      <line x1="5" y1="20" x2="15" y2="20" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" />
      {/* Red marker - Bottom horizontal line */}
      <line
        x1="25"
        y1="20"
        x2="35"
        y2="20"
        stroke="#ff0000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Red marker - Left vertical line */}
      <line x1="20" y1="5" x2="20" y2="15" stroke="#ff0000" strokeWidth="2" strokeLinecap="round" />
      {/* Red marker - Right vertical line */}
      <line
        x1="20"
        y1="25"
        x2="20"
        y2="35"
        stroke="#ff0000"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
