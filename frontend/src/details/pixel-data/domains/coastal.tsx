import { useAtomValue } from 'jotai';

import { pixelDrillerDataRows } from 'lib/state/pixel-driller';

import { HazardAccordion } from '../hazard-accordion';
import { PixelDataGrid } from '../pixel-data-grid';

const title = 'Coastal flooding';

const COASTAL_FLOOD_PARAMETERS = [
  { epoch: 2010, rcp: 'baseline' },
  { epoch: 2030, rcp: '4.5' },
  { epoch: 2030, rcp: '8.5' },
  { epoch: 2050, rcp: '4.5' },
  { epoch: 2050, rcp: '8.5' },
  { epoch: 2070, rcp: '4.5' },
  { epoch: 2070, rcp: '8.5' },
  { epoch: 2100, rcp: '4.5' },
  { epoch: 2100, rcp: '8.5' },
];

const DataSection = ({ pixel_layer }) => {
  const rows = useAtomValue(
    pixelDrillerDataRows({
      pixel_layer,
      layerParams: COASTAL_FLOOD_PARAMETERS,
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
        <PixelDataGrid pixel_layer={pixel_layer} parameters={COASTAL_FLOOD_PARAMETERS} />
      </HazardAccordion>
    </>
  );
};

export default DataSection;
