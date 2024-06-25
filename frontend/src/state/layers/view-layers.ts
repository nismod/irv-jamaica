import { waitForAll } from 'recoil';
import bboxPolygon from '@turf/bbox-polygon';

import { ViewLayer, viewOnlyLayer } from 'lib/data-map/view-layers';
import { selector } from 'recoil';
import { ConfigTree } from 'lib/nested-config/config-tree';
import { hoveredAdaptationFeatureState } from 'details/adaptations/FeatureAdaptationsTable';
import { extendBbox } from 'lib/bounding-box';
import { boundingBoxLayer } from 'lib/deck/layers/bounding-box-layer';

import { buildingLayersState } from './buildings';
import { droughtOptionsLayerState, droughtRegionsLayerState } from './drought';
import { marineLayerState } from './marine';
import { networkLayersState } from './networks';
import { hazardLayerState } from './hazards';
import { regionsLayerState } from './regions';
import { terrestrialLayerState } from './terrestrial';
import { labelsLayerState } from './labels';

export const featureBoundingBoxLayerState = selector<ViewLayer>({
  key: 'featureBoundingBoxLayerState',
  get: ({ get }) => {
    const hoveredAdaptationFeature = get(hoveredAdaptationFeatureState);

    if (!hoveredAdaptationFeature) return null;

    const geom = bboxPolygon(extendBbox(hoveredAdaptationFeature.bbox, 5));

    return viewOnlyLayer(`feature-bounding-box-${hoveredAdaptationFeature.id}`, ({ deckProps }) =>
      boundingBoxLayer({ bboxGeom: geom }, deckProps),
    );
  },
});

export const viewLayersState = selector<ConfigTree<ViewLayer>>({
  key: 'viewLayersState',
  get: ({ get }) => [
    get(
      waitForAll([
        regionsLayerState,
        droughtRegionsLayerState,
        terrestrialLayerState,
        marineLayerState,
        hazardLayerState,
        buildingLayersState,
        networkLayersState,
        droughtOptionsLayerState,
        featureBoundingBoxLayerState,
        labelsLayerState,
      ]),
    ),
  ],
});
