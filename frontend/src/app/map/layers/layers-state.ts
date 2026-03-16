import { atom } from 'jotai';

import { BackgroundName } from 'app/config/basemaps';

export const backgroundState = atom<BackgroundName>('light');
backgroundState.debugLabel = 'background';

export const showLabelsState = atom<boolean>(true);
showLabelsState.debugLabel = 'showLabels';
