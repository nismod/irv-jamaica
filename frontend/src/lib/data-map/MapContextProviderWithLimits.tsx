import omit from 'lodash/omit';
import { FC, ReactNode, useContext, useMemo } from 'react';
import { MapContext, MapContextProps } from 'react-map-gl';

import { ViewStateContext } from './DeckMap';

/**
 * Needed to add the missing view state limits (maxZoom etc) to the react-map-gl MapContext.
 *
 * Deck.gl doesn't forward these properties to the context it creates,
 * so react-map-gl components like NavigationControl end up resetting the viewLimits to defaults.
 *
 * CAUTION: after this extension, the viewport is no longer a proper deck.gl WebMercatorViewport.
 * It's just a plain object with the properties copied over, but it has no prototype attached.
 * So users of the context can't use viewport.fitBounds(...) etc.
 * This was a side effect of deck passing its own viewport into the MapContext, anyway.
 */
export const MapContextProviderWithLimits: FC<{
  children: ReactNode;
  value: MapContextProps;
}> = ({ value, children }) => {
  const baseContext = value;
  const {
    viewState: { minPitch, maxPitch, minZoom, maxZoom },
  } = useContext(ViewStateContext);

  // need to make a plain object out of viewport, and then assign the missing fields
  const plainViewport = Object.fromEntries(Object.entries(baseContext.viewport ?? {}));

  const extendedContext = useMemo(
    () => ({
      ...omit(baseContext, 'viewport'),
      viewport: { ...plainViewport, minPitch, maxPitch, minZoom, maxZoom } as any,
    }),
    [baseContext, plainViewport, minPitch, maxPitch, minZoom, maxZoom],
  );
  return <MapContext.Provider value={extendedContext}>{children}</MapContext.Provider>;
};
