import { atom } from 'jotai';
export type MapInteractionMode = 'standard' | 'pixel-driller';
export const mapInteractionModeState = atom<MapInteractionMode>('standard');
