import { FC, useEffect, useMemo } from 'react';
import { useSetRecoilState } from 'lib/jotai-compat/recoil';
import { useAtomValue } from 'jotai';

import { interactionGroupsState } from 'app/state/layers/interaction-groups';
import { viewLayerConfigs } from 'app/state/layers/view-layers';

import { DataMap } from 'lib/data-map/DataMap';
import { ViewLayer } from 'lib/data-map/view-layers';
import { viewLayersFlatState } from 'lib/state/layers/view-layers';

import { backgroundState, showLabelsState } from './layers/layers-state';
import { useBasemapStyle } from './use-basemap-style';
import { flattenConfig } from 'lib/nested-config/flatten-config';

export const DataMapContainer: FC = () => {
  const background = useAtomValue(backgroundState);
  const showLabels = useAtomValue(showLabelsState);
  const viewLayers = useAtomValue(viewLayerConfigs);
  const setViewLayersFlat = useSetRecoilState(viewLayersFlatState);
  const { firstLabelId } = useBasemapStyle(background, showLabels);
  const interactionGroups = useAtomValue(interactionGroupsState);
  const flattenedViewLayers = useMemo(() => flattenConfig(viewLayers), [viewLayers]) as ViewLayer[];

  useEffect(() => {
    setViewLayersFlat(flattenedViewLayers);
  }, [flattenedViewLayers, setViewLayersFlat]);

  return (
    <DataMap
      firstLabelId={firstLabelId}
      interactionGroups={interactionGroups}
      viewLayers={flattenedViewLayers}
    />
  );
};
