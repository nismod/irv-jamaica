import { createElement } from 'react';
import GL from '@luma.gl/constants';
import { RiskParams } from './domains';

import { rasterTileLayer } from 'lib/deck/layers/raster-tile-layer';
import { ViewLayer } from 'lib/data-map/view-layers';
import { RasterTarget } from 'lib/data-map/types';

import { RiskLegend } from './RiskLegend';
import { RiskHoverDescription } from './RiskHoverDescription';
import * as RISKS_COLOR_MAPS from './color-maps';
import { RISK_SOURCE } from './source';

export function getRiskId<
  F extends string, // risk variable
  RP extends number,
  RCP extends string,
  E extends number,
  C extends number | string,
>({
  riskType,
  hazard,
  returnPeriod,
  rcp,
  epoch,
  confidence,
}: {
  riskType: F;
  hazard: string;
  returnPeriod: RP;
  rcp: RCP;
  epoch: E;
  confidence: C;
}) {
  return `${riskType}__${hazard}__rp_${returnPeriod}__rcp_${rcp}__epoch_${epoch}__conf_${confidence}` as const;
}

export function riskViewLayer(riskType: string, riskParams: RiskParams): ViewLayer {
  const { hazard, returnPeriod, rcp, epoch, confidence } = riskParams;

  const deckId = getRiskId({ riskType, hazard, returnPeriod, rcp, epoch, confidence });

  return {
    id: riskType,
    group: 'risks',
    spatialType: 'raster',
    interactionGroup: 'risks',
    params: { riskType, riskParams },
    fn: ({ deckProps }) => {
      const { scheme, range } = RISKS_COLOR_MAPS[riskType];
      const dataURL = RISK_SOURCE.getDataUrl(
        {
          riskType,
        },
        { scheme, range },
      );

      return rasterTileLayer(
        {
          textureParameters: {
            [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
          },
          opacity: riskType === 'cyclone' ? 0.6 : 1,
        },
        deckProps,
        {
          id: `${riskType}@${deckId}`, // follow the convention viewLayerId@deckLayerId
          data: dataURL,
          refinementStrategy: 'no-overlap',
        },
      );
    },
    renderLegend() {
      return createElement(RiskLegend, {
        key: riskType,
        viewLayer: this,
      });
    },
    renderTooltip({ target }: { target: RasterTarget }) {
      return createElement(RiskHoverDescription, { key: this.id, target, viewLayer: this });
    },
  };
}
