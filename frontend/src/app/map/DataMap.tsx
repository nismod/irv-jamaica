import { FC, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { interactionGroupsState } from 'app/state/layers/interaction-groups';
import { viewLayerConfigs } from 'app/state/layers/view-layers';

import { DataMap } from 'lib/data-map/DataMap';
import { viewLayersFlatState } from 'lib/state/layers/view-layers';

import { backgroundState, showLabelsState } from './layers/layers-state';
import { useBasemapStyle } from './use-basemap-style';
import { flattenConfig } from 'lib/nested-config/flatten-config';
import { protectedFeatureLayersState } from 'lib/state/protected-features';
import { networkTreeCheckboxState } from 'data-layers/networks/state/data-selection';

export const DataMapContainer: FC = () => {
  const background = useRecoilValue(backgroundState);
  const showLabels = useRecoilValue(showLabelsState);
  const viewLayers = useRecoilValue(viewLayerConfigs);
  const [viewLayersFlat, setViewLayersFlat] = useRecoilState(viewLayersFlatState);
  const { firstLabelId } = useBasemapStyle(background, showLabels);
  const interactionGroups = useRecoilValue(interactionGroupsState);

  /* This is a horrible hack which forces all layer IDs in protectedFeatureLayersState to be visible. */
  const protectedFeatureLayers = useRecoilValue(protectedFeatureLayersState);
  const [checkboxState, setCheckboxState] = useRecoilState(networkTreeCheckboxState);
  console.log({ protectedFeatureLayers });
  protectedFeatureLayers?.forEach((layer: string) => {
    if (!checkboxState.checked[layer]) {
      console.log(layer, checkboxState.checked[layer]);
      setCheckboxState((prev) => ({ ...prev, checked: { ...prev.checked, [layer]: true } }));
    }
  });
  console.log(checkboxState);

  useEffect(() => {
    setViewLayersFlat(flattenConfig(viewLayers));
  }, [viewLayers, setViewLayersFlat]);

  return <DataMap firstLabelId={firstLabelId} interactionGroups={interactionGroups} />;
};
