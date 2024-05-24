import difference from 'lodash/difference';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import { atom } from 'recoil';

import { StateEffect } from 'lib/recoil/state-effects/types';

import { SECTIONS_CONFIG } from 'config/sections';
import { VIEW_SECTIONS } from 'config/views';
import {
  sectionStyleOptionsState,
  sectionStyleValueState,
  sectionVisibilityState,
  sidebarSectionExpandedState,
} from 'state/sections';

export const viewState = atom({
  key: 'viewState',
  default: 'exposure',
});

export const viewStateEffect: StateEffect<string> = ({ set }, view, previousView) => {
  const viewSectionsConfig = VIEW_SECTIONS[view];

  const previousViewSectionsConfig = VIEW_SECTIONS[previousView];
  const removedSections = difference(
    keys(previousViewSectionsConfig),
    keys(viewSectionsConfig),
  );

  removedSections.forEach((section) => {
    set(sectionVisibilityState(section), false);
  });

  forEach(viewSectionsConfig, (sectionConfig, section) => {
    set(sectionVisibilityState(section), sectionConfig.visible);
    set(sidebarSectionExpandedState(section), sectionConfig.expanded);
    const styleOptions = sectionConfig.styles?.map(
      (style) => SECTIONS_CONFIG[section].styles[style],
    );
    set(sectionStyleOptionsState(section), styleOptions);
    set(sectionStyleValueState(section), sectionConfig.defaultStyle);
  });
};
