import { FC, useEffect } from 'react';
import { useRecoilValue } from 'recoil';

import { interactionGroupsState } from 'app/state/layers/interaction-groups';
import { viewLayersFlatState } from 'app/state/layers/view-layers-flat';
import { useSaveViewLayers, viewLayersParamsState } from 'app/state/layers/view-layers-params';

import { DataMap } from 'lib/data-map/DataMap';

import { backgroundState, showLabelsState } from './layers/layers-state';
import { useBasemapStyle } from './use-basemap-style';

export const DataMapContainer: FC = () => {
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const viewLayers = useRecoilValue(viewLayersFlatState);
  const saveViewLayers = useSaveViewLayers();
  const { firstLabelId } = useBasemapStyle(background, showLabels);

  useEffect(() => {
    saveViewLayers(viewLayers);
  }, [saveViewLayers, viewLayers]);

  const viewLayersParams = useRecoilValue(viewLayersParamsState);

  const interactionGroups = useRecoilValue(interactionGroupsState);

  return (
    <DataMap
      firstLabelId={firstLabelId}
      interactionGroups={interactionGroups}
      viewLayers={viewLayers}
      viewLayersParams={viewLayersParams}
    />
  );
};
