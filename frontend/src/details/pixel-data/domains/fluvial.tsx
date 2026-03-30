import { useAtomValue } from 'jotai';

import { pixelDrillerDataRecords } from 'lib/state/pixel-driller';

import { HazardAccordion } from '../hazard-accordion';
import { EpochReturnPeriodChart } from '../epoch-return-period-chart';
import type { PixelRecord, PixelRecordKeys } from '../types';
import { buildDomainExportFile } from '../download/download-generators';
import {
  ExportConfig,
  ExportFunction,
  MetadataArgs,
  useRegisterExportConfig,
} from '../download/download-context';
import type { DatapackageTableSchemaField, RdlsDataset } from '../download/metadata-types';
import {
  COMMON_DIALECT,
  COMMON_PUBLISHER,
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
} from '../download/metadata-common';
import type { RagStatus } from '../rag/rag-types';

const title = 'River flooding';
const downloadId = 'river_flood';

const FLOOD_PARAMETERS = [
  { epoch: 2010, rcp: 'baseline' },
  { epoch: 2050, rcp: '2.6' },
  { epoch: 2050, rcp: '4.5' },
  { epoch: 2050, rcp: '8.5' },
  { epoch: 2080, rcp: '2.6' },
  { epoch: 2080, rcp: '4.5' },
  { epoch: 2080, rcp: '8.5' },
];

const exportColumns: DatapackageTableSchemaField[] = [
  { name: 'rp', type: 'number', title: 'Return period', description: 'Return period (years).' },
  { name: 'value', type: 'number', title: 'Flood height', description: 'Flood height (m).' },
  { name: 'rcp', type: 'string', title: 'RCP', description: 'RCP' },
  { name: 'epoch', type: 'number', title: 'Epoch', description: 'Epoch (year).' },
  { name: 'unit', type: 'string', title: 'Unit', description: 'Flooding depth unit' },
  { name: 'variable', type: 'string', title: 'Variable', description: 'Flooding level variable.' },
];

const isRiverFloodRecord = (record: PixelRecord): record is PixelRecord<RiverFloodKeys> => {
  return record.layer.domain === 'fluvial';
};

const filterRecords = (records: PixelRecord[]): PixelRecord<RiverFloodKeys>[] => {
  return records.filter(isRiverFloodRecord);
};

const exportRecords: ExportFunction = async (allRecords) => {
  const filtered = filterRecords(allRecords);
  return buildDomainExportFile(downloadId, exportColumns, filtered);
};

export const getMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: downloadId,
  title: 'River Flooding',
  description: 'River flood height hazard at this site across multiple return periods.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${downloadId}.csv`,
      title: 'River Flooding Data',
      description: 'River flood height data for this site across return periods.',
      format: 'csv',
      schema: {
        fields: [
          {
            name: 'rp',
            type: 'number',
            title: 'Return period',
            description: 'Return period (years).',
          },
          {
            name: 'value',
            type: 'number',
            title: 'Flood height',
            description: 'Flood height (m).',
          },
          {
            name: 'rcp',
            type: 'string',
            title: 'RCP',
            description: 'RCP',
          },
          {
            name: 'epoch',
            type: 'number',
            title: 'Epoch',
            description: 'Epoch (year).',
          },
          {
            name: 'confidence',
            type: 'string',
            title: 'Confidence level',
            description: 'Confidence level',
          },
          {
            name: 'unit',
            type: 'string',
            title: 'Unit',
            description: 'Flooding depth unit',
          },
          {
            name: 'variable',
            type: 'string',
            title: 'Variable',
            description: 'Flooding level variable.',
          },
        ],
      },
      dialect: COMMON_DIALECT,
    },
  ],
  publisher: COMMON_PUBLISHER,
  license: 'CC-BY 4.0',
  contact_point: COMMON_CONTACT_POINT,
  creator: COMMON_CREATOR,
  sources: [],
});

const exportConfig: ExportConfig = {
  exportFunction: exportRecords,
  metadataFunction: getMetadata,
  readmeFunction: () => ({
    datasetDescription: 'PLACEHOLDER: River flooding dataset description.',
    datasetSources: ['PLACEHOLDER: River flooding dataset source 1.'],
  }),
};
export interface RiverFloodKeys extends PixelRecordKeys {
  rp?: string;
  rcp?: string;
  epoch?: string;
  unit?: string;
  variable?: string;
}

const getRagStatus = (records): RagStatus => {
  if (records.every((rec) => !Number.isFinite(rec.value))) {
    return 'no-data';
  }
  return 'green';
};

const DataSection = ({ pixel_layer }) => {
  const records = useAtomValue(
    pixelDrillerDataRecords({
      pixel_layer,
      layerParams: FLOOD_PARAMETERS,
    }),
  );

  useRegisterExportConfig('fluvial', exportConfig);

  if (!records.length) {
    return null;
  }

  const variable = records[0].variable;
  const unit = records[0].unit;

  return (
    <HazardAccordion
      id={pixel_layer}
      title={`${title}: ${variable} (${unit})`}
      status={getRagStatus(records)}
    >
      <EpochReturnPeriodChart records={records} fieldTitle={`${variable} (${unit})`} />
    </HazardAccordion>
  );
};

export default DataSection;
