import ZoomIn from '@mui/icons-material/ZoomIn';
import ZoomOut from '@mui/icons-material/ZoomOut';
import { IconButton, TableCell } from '@mui/material';
import { Box } from '@mui/system';
import { ExpandableRow } from 'lib/asset-list/ExpandableRow';
import { SortedAssetTable } from 'lib/asset-list/SortedAssetTable';
import { ListFeature } from 'lib/asset-list/use-sorted-features';
import { getAssetDataFormats } from 'data-layers/assets/data-formats';
import { FeatureSidebarContent } from 'details/features/FeatureSidebarContent';
import { BoundingBox, extendBbox } from 'lib/bounding-box';
import { colorMap } from 'lib/color-map';
import { mapFitBoundsState } from 'lib/map/MapBoundsFitter';
import { ColorBox } from 'lib/map/tooltip/content/ColorBox';
import { useCallback, useMemo } from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  adaptationColorSpecState,
  adaptationFieldSpecState,
  adaptationLayerSpecState,
} from 'data-layers/networks/state/layer';

import './asset-table.css';

export const hoveredAdaptationFeatureState = atom<ListFeature>({
  key: 'hoveredAdaptationFeatureState',
  default: null,
});

export const selectedAdaptationFeatureState = atom<ListFeature>({
  key: 'selectedAdaptationFeatureState',
  default: null,
});

const JAMAICA_BBOX: BoundingBox = [-79.61792, 16.788765, -74.575195, 19.487308];

export const FeatureAdaptationsTable = () => {
  const layerSpec = useRecoilValue(adaptationLayerSpecState);
  const fieldSpec = useRecoilValue(adaptationFieldSpecState);
  const colorSpec = useRecoilValue(adaptationColorSpecState);

  const setHoveredFeature = useSetRecoilState(hoveredAdaptationFeatureState);
  const [selectedFeature, setSelectedFeature] = useRecoilState(selectedAdaptationFeatureState);
  const setMapFitBounds = useSetRecoilState(mapFitBoundsState);

  const handleZoomInFeature = useCallback(
    (feature: ListFeature) => feature && setMapFitBounds(extendBbox(feature.bbox, 1)),
    [setMapFitBounds],
  );

  const handleZoomOutJamaica = useCallback(
    () => setMapFitBounds([...JAMAICA_BBOX]),
    [setMapFitBounds],
  );

  const colorFn = useMemo(() => colorMap(colorSpec), [colorSpec]);
  const { getDataLabel, getValueFormatted } = getAssetDataFormats(fieldSpec);

  return (
    <>
      <Box position="absolute" top={0} right={25} zIndex={1000}>
        <IconButton onClick={handleZoomOutJamaica} title="Zoom out to whole island">
          <ZoomOut />
        </IconButton>
      </Box>
      <SortedAssetTable
        layerSpec={layerSpec}
        fieldSpec={fieldSpec}
        header={
          <>
            <TableCell width={10}>#</TableCell>
            <TableCell colSpan={2}>{getDataLabel(fieldSpec)}</TableCell>
          </>
        }
        renderRow={(feature, localIndex, globalIndex) => (
          <ExpandableRow
            key={feature.string_id}
            expanded={feature === selectedFeature}
            onExpandedChange={(expanded) => setSelectedFeature(expanded ? feature : null)}
            onMouseEnter={() => setHoveredFeature(feature)}
            onMouseLeave={() => setHoveredFeature(null)}
            expandableContent={
              <Box py={1}>
                <FeatureSidebarContent
                  feature={feature}
                  assetType={feature.layer}
                  showRiskSection={false}
                />
              </Box>
            }
          >
            <TableCell>{globalIndex + 1}</TableCell>
            <TableCell>
              <ColorBox color={colorFn(feature.value)} />
              {getValueFormatted(feature.value, fieldSpec)}
            </TableCell>
            <TableCell>
              <IconButton
                title="Zoom in to asset"
                className="row-hovered-visible"
                size="small"
                sx={{
                  padding: 0,
                }}
                onClick={(e) => {
                  handleZoomInFeature(feature);
                  e.stopPropagation();
                }}
              >
                <ZoomIn />
              </IconButton>
            </TableCell>
          </ExpandableRow>
        )}
      />
    </>
  );
};
