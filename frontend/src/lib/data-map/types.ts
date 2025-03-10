import { GeoJSONFeature } from 'maplibre-gl';
import { ViewLayer } from './view-layers';

export type InteractionStyle = 'vector' | 'raster';

export interface InteractionGroupConfig {
  id: string;
  type: InteractionStyle;
  pickingRadius?: number;
  pickMultiple?: boolean;
  usesAutoHighlight?: boolean;
  Component?: React.ComponentType<{
    target: RasterTarget | VectorTarget;
    viewLayer: ViewLayer;
  }>;
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
  feature: GeoJSONFeature;
}

export type InteractionLayer = InteractionTarget<VectorTarget> | InteractionTarget<RasterTarget>;

export interface RasterHoverDescription {
  target: RasterTarget;
  viewLayer: ViewLayer;
}

export interface VectorHoverDescription {
  target: VectorTarget;
  viewLayer: ViewLayer;
}

export interface HoverDescription {
  target: RasterTarget | VectorTarget;
  viewLayer: ViewLayer;
}
