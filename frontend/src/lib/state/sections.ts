import { atom } from 'jotai';
import { atomFamily } from 'jotai-family';
import { locationAtom, readUrlBool, readUrlString, setUrlParam } from 'lib/state/map-view/map-url';

export const sectionVisibilityState = atomFamily((id: string) =>
  atom(
    (get) => readUrlBool(get(locationAtom).searchParams, id, false),
    (_get, set, value: boolean) => set(locationAtom, setUrlParam(id, value)),
  ),
);

export const sidebarSectionExpandedState = atomFamily(() => atom(false));

export const sectionStyleValueState = atomFamily((id: string) =>
  atom(
    (get) => readUrlString(get(locationAtom).searchParams, `${id}Style`, ''),
    (_get, set, value: string) => set(locationAtom, setUrlParam(`${id}Style`, value)),
  ),
);

export interface StyleSelectionOption {
  id: string;
  label: string;
}

export const sectionStyleOptionsState = atomFamily(() => atom<StyleSelectionOption[]>([]));

export const sectionStyleDefaultValueState = atomFamily(() => atom<string | null>(null));
