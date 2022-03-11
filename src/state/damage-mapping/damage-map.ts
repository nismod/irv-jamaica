import _ from 'lodash';
import { atom, selector } from 'recoil';

import { HAZARD_DOMAINS } from 'config/hazards/domains';
import { dataParamOptionsState, dataParamState } from 'state/data-params';
import { hazardSelectionState } from 'state/hazards/hazard-selection';
import { networksStyleState } from 'state/networks/networks-style';

export const showDirectDamagesState = selector({
  key: 'showDamagesState',
  get: ({ get }) => get(networksStyleState) === 'direct-damages',
});

export const damageSourceState = atom({
  key: 'damageSourceState',
  default: 'total-damages',
});

export const damageSourceStateEffect = ({ get, set }, damageSource) => {
  syncHazardsWithDamageSourceStateEffect({ get, set }, damageSource);

  if (damageSource !== 'total-damages') {
    const damageSourceReturnPeriodDomain = get(dataParamOptionsState({ group: damageSource, param: 'returnPeriod' }));
    const topReturnPeriod = damageSourceReturnPeriodDomain[damageSourceReturnPeriodDomain.length - 1];

    // CAUTION: this won't resolve the dependencies between data params if any depend on the return period
    set(dataParamState({ group: damageSource, param: 'returnPeriod' }), topReturnPeriod);
  }
};

function syncHazardsWithDamageSourceStateEffect({ get, set }, damageSource) {
  _.forEach(HAZARD_DOMAINS, (groupConfig, group) => {
    set(hazardSelectionState(group), group === damageSource);
  });
}