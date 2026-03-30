import { useAtomValue } from 'jotai';

import { pixelDrillerDataRecords } from 'lib/state/pixel-driller';

import { HazardAccordion } from '../hazard-accordion';
import { EpochReturnPeriodChart } from '../epoch-return-period-chart';
import {
  ExportFunction,
  MetadataArgs,
  ExportConfig,
  useRegisterExportConfig,
} from '../download/download-context';
import { buildDomainExportFile } from '../download/download-generators';
import {
  COMMON_DIALECT,
  COMMON_PUBLISHER,
  COMMON_CONTACT_POINT,
  COMMON_CREATOR,
} from '../download/metadata-common';
import type { DatapackageTableSchemaField, RdlsDataset } from '../download/metadata-types';
import type { PixelRecordKeys, PixelRecord } from '../types';
import type { RagStatus } from '../rag/rag-types';
import { calculateRagFromReturnPeriodValuesOneThreshold } from '../rag/rag-calculation';

const title = 'Cyclones';
const downloadId = 'cyclone';

const CYCLONE_INTENSITY_THRESHOLD = 50; // m/s
// confidence 5 and 50 also available in data
const CYCLONE_PARAMETERS = [
  { confidence: 95, epoch: 2010, rcp: 'baseline' },
  { confidence: 95, epoch: 2050, rcp: '4.5' },
  { confidence: 95, epoch: 2050, rcp: '8.5' },
  { confidence: 95, epoch: 2100, rcp: '4.5' },
  { confidence: 95, epoch: 2100, rcp: '8.5' },
];

const exportColumns: DatapackageTableSchemaField[] = [
  { name: 'rp', type: 'number', title: 'Return period', description: 'Return period (years).' },
  {
    name: 'value',
    type: 'number',
    title: 'Cyclone intensity',
    description: 'Cyclone intensity (m/s).',
  },
  { name: 'rcp', type: 'string', title: 'RCP', description: 'RCP' },
  { name: 'epoch', type: 'number', title: 'Epoch', description: 'Epoch (year).' },
  {
    name: 'confidence',
    type: 'string',
    title: 'Confidence level',
    description: 'Confidence level',
  },
  { name: 'unit', type: 'string', title: 'Unit', description: 'Cyclone intensity unit' },
  {
    name: 'variable',
    type: 'string',
    title: 'Variable',
    description: 'Cyclone intensity variable.',
  },
];

export interface CycloneKeys extends PixelRecordKeys {
  rp?: string;
  rcp?: string;
  epoch?: string;
  confidence?: string;
  unit?: string;
  variable?: string;
}

const isCycloneRecord = (record: PixelRecord): record is PixelRecord<CycloneKeys> => {
  return record.layer.domain === 'cyclone';
};

const filterRecords = (records: PixelRecord[]): PixelRecord<CycloneKeys>[] => {
  return records.filter(isCycloneRecord);
};

const exportRecords: ExportFunction = async (allRecords) => {
  const filtered = filterRecords(allRecords);
  return buildDomainExportFile(downloadId, exportColumns, filtered);
};

export const getMetadata = ({ spatial }: MetadataArgs): RdlsDataset => ({
  id: downloadId,
  title: 'Cyclones',
  description: 'Cyclone hazard at this site across multiple return periods.',
  risk_data_type: ['hazard'],
  spatial,
  resources: [
    {
      id: `${downloadId}.csv`,
      title: 'Cyclone Data',
      description: 'Cyclone data for this site across return periods.',
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
            title: 'Cyclone intensity',
            description: 'Cyclone intensity (m/s).',
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
            description: 'Cyclone intensity unit',
          },
          {
            name: 'variable',
            type: 'string',
            title: 'Variable',
            description: 'Cyclone intensity variable.',
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
    datasetDescription: 'PLACEHOLDER: Cyclone dataset description.',
    datasetSources: ['PLACEHOLDER: Cyclone dataset source 1.'],
  }),
};

const getRagStatus = (records): RagStatus => {
  if (records.every((rec) => !Number.isFinite(rec.value))) {
    return 'no-data';
  }
  return calculateRagFromReturnPeriodValuesOneThreshold(
    records,
    CYCLONE_INTENSITY_THRESHOLD,
    10,
    100,
  );
};

const DataSection = ({ pixel_layer }) => {
  const records = useAtomValue(
    pixelDrillerDataRecords({
      pixel_layer,
      layerParams: CYCLONE_PARAMETERS,
    }),
  );

  useRegisterExportConfig('cyclone', exportConfig);

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
