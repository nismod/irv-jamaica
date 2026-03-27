import forEach from 'lodash/forEach';
import { atom } from 'jotai';

import { setParamToTopValue } from 'lib/state/data-params';

import { HAZARD_DOMAINS } from 'data-layers/hazards/domains';
import { hazardSelectionState } from 'data-layers/hazards/state/data-selection';
import { networksStyleState } from 'data-layers/networks/state/data-selection';

export const showDamagesState = atom((get) => get(networksStyleState) === 'damages');

export const damageSourceStateEffect = ({ get, set }, damageSource) => {
  forEach(HAZARD_DOMAINS, (groupConfig, group) => {
    set(hazardSelectionState(group), group === damageSource);
  });

  if (damageSource !== 'all') {
    // CAUTION: this won't resolve the dependencies between data params if any depend on the return period
    setParamToTopValue({ get, set }, damageSource, 'returnPeriod');
  }
};
