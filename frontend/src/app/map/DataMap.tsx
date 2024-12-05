import { FC, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { interactionGroupsState } from 'app/state/layers/interaction-groups';
import { viewLayerConfigs } from 'app/state/layers/view-layers';

import { DataMap } from 'lib/data-map/DataMap';
import { viewLayersFlatState } from 'lib/state/layers/view-layers';

import { backgroundState, showLabelsState } from './layers/layers-state';
import { useBasemapStyle } from './use-basemap-style';
import { flattenConfig } from 'lib/nested-config/flatten-config';
import { protectedFeatureLayerVisibilityState } from 'data-layers/networks/state/data-selection';

export const DataMapContainer: FC = () => {
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const viewLayers = useRecoilValue(viewLayerConfigs);
  const setViewLayersFlat = useSetRecoilState(viewLayersFlatState);
  const { firstLabelId } = useBasemapStyle(background, showLabels);
  const interactionGroups = useRecoilValue(interactionGroupsState);
  const [protectedFeatureLayerVisibility, setProtectedFeatureLayerVisibility] = useRecoilState(
    protectedFeatureLayerVisibilityState,
  );
  console.log(protectedFeatureLayerVisibility);

  /* This is a horrible hack which forces all layer IDs in protectedFeatureLayersState to be visible. */
  if (!protectedFeatureLayerVisibility) {
    setProtectedFeatureLayerVisibility(true);
  }

  useEffect(() => {
    setViewLayersFlat(flattenConfig(viewLayers));
  }, [viewLayers, setViewLayersFlat]);

  return <DataMap firstLabelId={firstLabelId} interactionGroups={interactionGroups} />;
};
