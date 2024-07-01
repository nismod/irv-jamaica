import { ViewLayer } from './view-layers';

export type InteractionStyle = 'vector' | 'raster';

export interface InteractionGroupConfig {
  id: string;
  type: InteractionStyle;
  pickingRadius?: number;
  pickMultiple?: boolean;
  usesAutoHighlight?: boolean;
}

export interface InteractionTarget<T> {
  interactionGroup: string;
  interactionStyle: string;

  viewLayer: ViewLayer;
  // logicalLayer: string;

  target: T;
}

export interface RasterTarget {
  color: [number, number, number, number];
}

export interface VectorTarget {
  feature: any;
}
