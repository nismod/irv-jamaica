import difference from 'lodash/difference';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import { string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';

import { StateEffect } from 'lib/recoil/state-effects/types';
import {
  sectionStyleOptionsState,
  sectionStyleValueState,
  sectionVisibilityState,
  sidebarSectionExpandedState,
} from 'lib/state/sections';

import { SECTIONS_CONFIG } from 'app/config/sections';
import { VIEW_SECTIONS } from 'app/config/views';

export const viewState = atom({
  key: 'viewState',
  effects: [
    syncEffect({
      storeKey: 'map-view-route',
      itemKey: 'view',
      refine: string(),
    }),
  ],
});

function sectionVisibility(section, sectionConfig) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.has(section) ? searchParams.get(section) === 'true' : sectionConfig.visible;
}

function sectionStyle(section, sectionConfig) {
  const searchParams = new URLSearchParams(window.location.search);
  const styleParam = `${section}Style`;
  if (styleParam === 'assetsStyle') {
    return sectionConfig.defaultStyle;
  }
  return searchParams.has(styleParam)
    ? searchParams.get(styleParam).replaceAll('"', '')
    : sectionConfig.defaultStyle;
}

export const viewStateEffect: StateEffect<string> = ({ set }, view, previousView) => {
  const viewSectionsConfig = VIEW_SECTIONS[view];

  const previousViewSectionsConfig = VIEW_SECTIONS[previousView];
  const removedSections = difference(keys(previousViewSectionsConfig), keys(viewSectionsConfig));

  removedSections.forEach((section) => {
    set(sectionVisibilityState(section), false);
  });

  forEach(viewSectionsConfig, (sectionConfig, section) => {
    set(sectionVisibilityState(section), sectionVisibility(section, sectionConfig));
    set(sidebarSectionExpandedState(section), sectionConfig.expanded);
    const styleOptions = sectionConfig.styles?.map(
      (style) => SECTIONS_CONFIG[section].styles[style],
    );
    set(sectionStyleOptionsState(section), styleOptions);
    set(sectionStyleValueState(section), sectionStyle(section, sectionConfig));
  });
};
