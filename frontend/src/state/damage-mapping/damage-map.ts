import forEach from 'lodash/forEach';
import { atom, selector } from 'recoil';

import { HAZARD_DOMAINS } from 'data-layers/hazards/domains';
import { dataParamOptionsState, dataParamState } from 'state/data-params';
import { hazardSelectionState } from 'data-layers/hazards/state/data-selection';
import { networksStyleState } from 'data-layers/networks/state/data-selection';

export const showDamagesState = selector({
  key: 'showDamagesState',
  get: ({ get }) => get(networksStyleState) === 'damages',
});

export const damageSourceState = atom({
  key: 'damageSourceState',
  default: 'all',
});

export const damageTypeState = atom({
  key: 'damageTypeState',
  default: 'direct',
});

export const damageSourceStateEffect = ({ get, set }, damageSource) => {
  syncHazardsWithDamageSourceStateEffect({ set }, damageSource);

  if (damageSource !== 'all') {
    const damageSourceReturnPeriodDomain = get(
      dataParamOptionsState({ group: damageSource, param: 'returnPeriod' }),
    );
    const topReturnPeriod =
      damageSourceReturnPeriodDomain[damageSourceReturnPeriodDomain.length - 1];

    // CAUTION: this won't resolve the dependencies between data params if any depend on the return period
    set(dataParamState({ group: damageSource, param: 'returnPeriod' }), topReturnPeriod);
  }
};

function syncHazardsWithDamageSourceStateEffect({ set }, damageSource) {
  forEach(HAZARD_DOMAINS, (groupConfig, group) => {
    set(hazardSelectionState(group), group === damageSource);
  });
}
