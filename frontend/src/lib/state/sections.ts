import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { urlMemoBool, urlMemoStr } from 'lib/state/map-view/map-url';

export const sectionVisibilityState = atomFamily((id: string) => urlMemoBool(id, false));

export const sidebarSectionExpandedState = atomFamily(() => atom(false));

export const sectionStyleValueState = atomFamily((id: string) =>
  urlMemoStr(`${id}Style`, ''),
);

export interface StyleSelectionOption {
  id: string;
  label: string;
}

export const sectionStyleOptionsState = atomFamily(() => atom<StyleSelectionOption[]>([]));

export const sectionStyleDefaultValueState = atomFamily(() => atom<string | null>(null));
