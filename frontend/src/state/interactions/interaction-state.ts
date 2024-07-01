import { FC } from 'react';
import { selector } from 'recoil';

import { INTERACTION_GROUPS } from 'config/interaction-groups';
import { InteractionTarget, RasterTarget, VectorTarget } from 'lib/data-map/types';
import { hoverState, hasHover } from 'lib/state/interactions/interaction-state';
import { showPopulationState } from 'state/regions';
import { ViewLayer } from 'lib/data-map/view-layers';

type InteractionLayer = InteractionTarget<VectorTarget> | InteractionTarget<RasterTarget>;
type IT = InteractionLayer | InteractionLayer[];

const interactionGroupEntries = [...INTERACTION_GROUPS.entries()];

type LayerHoverState = {
  isHovered: boolean;
  hoverTarget: IT;
  Component: FC<{ target: RasterTarget | VectorTarget; viewLayer: ViewLayer }>;
};

export const layerHoverStates = selector({
  key: 'layerHoverStates',
  get: ({ get }) => {
    const regionDataShown = get(showPopulationState);
    const mapEntries = interactionGroupEntries.map(([groupId, group]) => {
      const hoverTarget = get(hoverState(groupId));
      const Component = group.Component;
      const isHovered =
        groupId === 'regions' ? regionDataShown && hasHover(hoverTarget) : hasHover(hoverTarget);
      return [groupId, { isHovered, hoverTarget, Component }] as [string, LayerHoverState];
    });
    return new Map<string, LayerHoverState>(mapEntries);
  },
});
