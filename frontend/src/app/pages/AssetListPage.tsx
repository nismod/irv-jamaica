import { useState } from 'react';
import { Box, Stack, TableCell, Typography } from '@mui/material';

import { FieldSpec } from 'lib/data-map/view-layers';

import { FieldSpecControl } from 'lib/asset-list/FieldSpecControl';
import { SortedAssetTable } from 'lib/asset-list/SortedAssetTable';
import { ListFeature } from 'lib/asset-list/use-sorted-features';
import { ExpandableRow } from 'lib/asset-list/ExpandableRow';
import { FeatureSidebarContent } from 'details/features/FeatureSidebarContent';
import { getAssetDataFormats } from 'data-layers/assets/data-formats';

export const AssetListPage = () => {
  const [layerSpec] = useState({
    layer: 'elec_edges_high', // TODO: enable filtering by sector/subsector/asset type
  });

  const [fieldSpec, setFieldSpec] = useState<FieldSpec>({
    fieldGroup: 'damages_expected',
    fieldDimensions: {
      hazard: 'cyclone',
      rcp: '4.5',
      epoch: 2050,
      protection_standard: 0,
    },
    fieldParams: {},
    field: 'ead_mean',
  });

  const [selectedFeature, setSelectedFeature] = useState<ListFeature>(null);

  const { getDataLabel, getValueFormatted } = getAssetDataFormats(fieldSpec);

  return (
    <>
      <article>
        <Stack spacing={2}>
          <Typography variant="h4">Asset list</Typography>
          <Box>
            <Typography variant="h6">Choose variable to sort assets by</Typography>

            <FieldSpecControl fieldSpec={fieldSpec} onFieldSpec={setFieldSpec} />
          </Box>
          <SortedAssetTable
            layerSpec={layerSpec}
            fieldSpec={fieldSpec}
            header={
              <>
                <TableCell>#</TableCell>
                <TableCell>Asset ID</TableCell>
                <TableCell>{getDataLabel(fieldSpec)}</TableCell>
              </>
            }
            renderRow={(feature, localIndex, globalIndex) => (
              <ExpandableRow
                key={feature.string_id}
                expanded={selectedFeature === feature}
                onExpandedChange={(newExpanded) => setSelectedFeature(newExpanded ? feature : null)}
                expandableContent={
                  <>
                    <FeatureSidebarContent feature={feature} assetType={feature.layer} />
                  </>
                }
              >
                <TableCell>{globalIndex + 1}</TableCell>
                <TableCell>{feature.string_id}</TableCell>
                <TableCell>{getValueFormatted(feature.value, fieldSpec)}</TableCell>
              </ExpandableRow>
            )}
          />
        </Stack>
      </article>
    </>
  );
};
