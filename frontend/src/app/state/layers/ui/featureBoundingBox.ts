import { selector } from 'recoil';
import bboxPolygon from '@turf/bbox-polygon';

import { ViewLayer, viewOnlyLayer } from 'lib/data-map/view-layers';
import { hoveredAdaptationFeatureState } from 'details/adaptations/FeatureAdaptationsTable';
import { extendBbox } from 'lib/bounding-box';
import { boundingBoxLayer } from 'lib/deck/layers/bounding-box-layer';

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
