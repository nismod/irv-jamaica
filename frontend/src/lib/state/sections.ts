import { bool, string } from '@recoiljs/refine';
import { atomFamily } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

export const sectionVisibilityState = atomFamily<boolean, string>({
  key: 'sectionVisibilityState',
  default: false,
  effects: (id) => [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: id,
      refine: bool(),
    }),
  ],
});

export const sidebarSectionExpandedState = atomFamily({
  key: 'sidebarSectionExpandedState',
  default: false,
});

export const sectionStyleValueState = atomFamily<string, string>({
  key: 'sectionStyleValueState',
  default: '',
  effects: (id) => [
    urlSyncEffect({
      storeKey: 'url-json',
      itemKey: `${id}Style`,
      refine: string(),
    }),
  ],
});

export interface StyleSelectionOption {
  id: string;
  label: string;
}

export const sectionStyleOptionsState = atomFamily<StyleSelectionOption[], string>({
  key: 'sectionStyleOptionsState',
  default: [],
});

export const sectionStyleDefaultValueState = atomFamily<string, string>({
  key: 'sectionStyleDefaultValueState',
  default: null,
});
