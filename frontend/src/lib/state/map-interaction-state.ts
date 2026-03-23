import { atomWithStoredStr } from './map-view/map-url';

export type MapInteractionMode = 'standard' | 'pixel-driller';
export const mapInteractionModeState = atomWithStoredStr<MapInteractionMode>('mode', 'standard');
