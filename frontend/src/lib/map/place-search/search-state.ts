import { atom } from 'jotai';

export const placeSearchActiveState = atom<boolean>(false);

export const placeSearchQueryState = atom<string>('');
