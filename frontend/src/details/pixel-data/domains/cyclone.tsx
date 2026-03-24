import { useAtomValue } from 'jotai';

import { pixelDrillerDataRows } from 'lib/state/pixel-driller';

import { HazardAccordion } from '../hazard-accordion';
import { PixelDataGrid } from '../pixel-data-grid';

const title = 'Cyclones';

// confidence 5 and 50 also available in data
const CYCLONE_PARAMETERS = [
  { confidence: 95, epoch: 2010, rcp: 'baseline' },
  { confidence: 95, epoch: 2050, rcp: '4.5' },
  { confidence: 95, epoch: 2050, rcp: '8.5' },
  { confidence: 95, epoch: 2100, rcp: '4.5' },
  { confidence: 95, epoch: 2100, rcp: '8.5' },
];


const DataSection = ({ pixel_layer }) => {
  const rows = useAtomValue(pixelDrillerDataRows({
    pixel_layer,
    layerParams: CYCLONE_PARAMETERS,
  }));

  if (!rows.length) {
    return null;
  }

  const variable = rows[0].variable;
  const unit = rows[0].unit;

  return (
    <>
      <HazardAccordion id={pixel_layer} title={`${title}: ${variable} (${unit})`}>
        <PixelDataGrid pixel_layer={pixel_layer} parameters={CYCLONE_PARAMETERS} />
      </HazardAccordion>
    </>
  );
};

export default DataSection;
