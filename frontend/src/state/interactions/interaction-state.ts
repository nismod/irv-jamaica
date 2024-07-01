import { selector } from 'recoil';

import { INTERACTION_GROUPS, tooltipLayers } from 'config/interaction-groups';
import { InteractionTarget, RasterTarget, VectorTarget } from 'lib/data-map/types';
import { hoverState, hasHover } from 'lib/state/interactions/interaction-state';
import { showPopulationState } from 'state/regions';

type InteractionLayer = InteractionTarget<VectorTarget> | InteractionTarget<RasterTarget>;
type IT = InteractionLayer | InteractionLayer[];

const interactionGroupIds = [...INTERACTION_GROUPS.keys()];

type LayerHoverState = {
  isHovered: boolean;
  target: IT;
  Component: React.ComponentType<{ hoveredObject: InteractionLayer }>;
};

export const layerHoverStates = selector({
  key: 'layerHoverStates',
  get: ({ get }) => {
    const regionDataShown = get(showPopulationState);
    const mapEntries = interactionGroupIds.map((group) => {
      const target = get(hoverState(group));
      const Component = tooltipLayers.get(group);
      const isHovered =
        group === 'regions' ? regionDataShown && hasHover(target) : hasHover(target);
      return [group, { isHovered, target, Component }] as [string, LayerHoverState];
    });
    return new Map<string, LayerHoverState>(mapEntries);
  },
});
