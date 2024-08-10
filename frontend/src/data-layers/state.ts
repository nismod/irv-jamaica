import { RecoilValueReadOnly } from 'recoil';
import { ViewLayer } from 'lib/data-map/view-layers';

export async function importLayerState(type: string): Promise<RecoilValueReadOnly<ViewLayer>> {
  const importName = `${type}LayerState`;
  const module = await import(`./${type}/state.ts`);
  return module[importName];
}
