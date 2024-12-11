import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { layerHoverStates } from 'app/state/interactions/interaction-state';
import { TooltipContent as BaseTooltip } from 'lib/map/tooltip/TooltipContent';

export const TooltipContent: FC = () => {
  const layerStates = useRecoilValue(layerHoverStates);

  return <BaseTooltip layerStates={layerStates} />;
};
