import { useAtomValue } from 'jotai';

import { pixelDrillerDataRows } from 'lib/state/pixel-driller';

import { HazardAccordion } from '../hazard-accordion';
import { PixelDataGrid } from '../pixel-data-grid';

const title = 'River flooding';

const FLOOD_PARAMETERS = [
  { epoch: 2010, rcp: 'baseline' },
  { epoch: 2050, rcp: '2.6' },
  { epoch: 2050, rcp: '4.5' },
  { epoch: 2050, rcp: '8.5' },
  { epoch: 2080, rcp: '2.6' },
  { epoch: 2080, rcp: '4.5' },
  { epoch: 2080, rcp: '8.5' },
];

const DataSection = ({ pixel_layer }) => {
  const rows = useAtomValue(
    pixelDrillerDataRows({
      pixel_layer,
      layerParams: FLOOD_PARAMETERS,
    }),
  );

  if (!rows.length) {
    return null;
  }

  const variable = rows[0].variable;
  const unit = rows[0].unit;

  return (
    <>
      <HazardAccordion id={pixel_layer} title={`${title}: ${variable} (${unit})`}>
        <PixelDataGrid pixel_layer={pixel_layer} parameters={FLOOD_PARAMETERS} />
      </HazardAccordion>
    </>
  );
};

export default DataSection;
