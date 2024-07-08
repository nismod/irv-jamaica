import { ScaleSequential } from 'd3-scale';
import { DataLoader } from 'lib/data-loader/data-loader';
import { Accessor } from 'lib/deck/props/getters';
import { InteractionTarget, VectorTarget, RasterTarget } from './types';

export interface FieldSpec {
  fieldGroup: string;
  fieldDimensions?: any;
  field: string;
  fieldParams?: any;
}

export interface ColorSpec {
  scheme: (t: number, n: number) => string;
  scale: (
    domain: [number, number],
    interpolator: (t: number, n: number) => string,
  ) => ScaleSequential<any, any>;
  range: [number, number];
  empty: string;
}
export interface ColorMap {
  fieldSpec: FieldSpec;
  colorSpec: ColorSpec;
}
export interface StyleParams {
  colorMap?: ColorMap;
}
export interface ViewLayerFunctionOptions {
  deckProps: any;
  zoom: number;
  styleParams?: StyleParams;
  selection?: InteractionTarget<VectorTarget> | InteractionTarget<RasterTarget>;
}

export interface DataManager {
  getDataAccessor: (layer: string, fieldSpec: FieldSpec) => Accessor<string>;
  getDataLoader: (layer: string, fieldSpec: FieldSpec) => DataLoader;
}

export interface FormatConfig<D = unknown> {
  getDataLabel: (fieldSpec: FieldSpec) => string;
  getValueFormatted: (value: D, fieldSpec: FieldSpec) => string;
}

export type ViewLayerDataAccessFunction = (fieldSpec: FieldSpec) => Accessor<string>;
export type ViewLayerDataFormatFunction = (fieldSpec: FieldSpec) => FormatConfig;

export interface ViewLayer {
  id: string;
  params?: any;
  styleParams?: StyleParams;
  group: string;
  fn: (options: ViewLayerFunctionOptions) => unknown;
  dataAccessFn?: ViewLayerDataAccessFunction;
  dataFormatsFn?: ViewLayerDataFormatFunction;
  legendDataFormatsFn?: ViewLayerDataFormatFunction;
  spatialType?: string;
  interactionGroup?: string;
  renderLegend?: () => JSX.Element;
  renderTooltip?: ({ target }: { target: RasterTarget | VectorTarget }) => JSX.Element;
}

export function viewOnlyLayer(id, fn): ViewLayer {
  return {
    id,
    group: null,
    interactionGroup: null,
    fn,
  };
}

export interface ViewLayerParams {
  selection?: any;
  styleParams?: StyleParams;
}
