import { useAtomValue } from 'jotai';

import { pixelDrillerDataRows } from 'lib/state/pixel-driller';

import { EpochReturnPeriodChart } from '../epoch-return-period-chart';
import { HazardAccordion } from '../hazard-accordion';

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
    <HazardAccordion id={pixel_layer} title={`${title}: ${variable} (${unit})`}>
      <EpochReturnPeriodChart rows={rows} fieldTitle={`${variable} (${unit})`} />
    </HazardAccordion>
  );
};

export default DataSection;
