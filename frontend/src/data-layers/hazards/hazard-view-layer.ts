import { createElement } from 'react';
import { HazardParams } from './domains';

import { rasterTileLayer } from 'lib/deck/layers/raster-tile-layer';
import { ViewLayer } from 'lib/data-map/view-layers';
import { RasterTarget } from 'lib/data-map/types';

import { HazardLegend } from './HazardLegend';
import { HazardHoverDescription } from './HazardHoverDescription';
import * as HAZARD_COLOR_MAPS from './color-maps';
import { HAZARD_SOURCE } from './source';

export function getHazardId<
  F extends string, //'fluvial' | 'surface' | 'coastal' | 'cyclone',
  RP extends number,
  RCP extends string,
  E extends number,
  C extends number | string,
>({
  hazardType,
  returnPeriod,
  rcp,
  epoch,
  confidence,
}: {
  hazardType: F;
  returnPeriod: RP;
  rcp: RCP;
  epoch: E;
  confidence: C;
}) {
  return `${hazardType}__rp_${returnPeriod}__rcp_${rcp}__epoch_${epoch}__conf_${confidence}` as const;
}

export function hazardViewLayer(hazardType: string, hazardParams: HazardParams): ViewLayer {
  const magFilter = ['cyclone', 'storm'].includes(hazardType) ? 'nearest' : 'linear';

  const { returnPeriod, rcp, epoch, confidence, speed } = hazardParams;

  const deckId = getHazardId({
    hazardType: hazardType === 'storm' ? `storm${speed}` : hazardType,
    returnPeriod,
    rcp,
    epoch,
    confidence,
  });

  return {
    id: hazardType,
    group: 'hazards',
    spatialType: 'raster',
    interactionGroup: 'hazards',
    params: { hazardType, hazardParams },
    fn: ({ deckProps }) => {
      const { scheme, range } = HAZARD_COLOR_MAPS[hazardType];

      return rasterTileLayer(
        {
          textureParameters: {
            magFilter,
          },
          opacity: ['storm', 'cyclone'].includes(hazardType) ? 0.6 : 1,
        },
        deckProps,
        {
          id: `${hazardType}@${deckId}`, // follow the convention viewLayerId@deckLayerId
          data: HAZARD_SOURCE.getDataUrl({ hazardType, hazardParams }, { scheme, range }),
          refinementStrategy: 'no-overlap',
        },
      );
    },
    renderLegend() {
      return createElement(HazardLegend, {
        key: hazardType,
        viewLayer: this,
      });
    },
    renderTooltip({ target }: { target: RasterTarget }) {
      return createElement(HazardHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
