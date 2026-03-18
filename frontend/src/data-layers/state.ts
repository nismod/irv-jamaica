import { Atom } from 'jotai';

import { ConfigViewLayer } from 'lib/data-map/view-layers';

export async function importLayerState(type: string): Promise<Atom<ConfigViewLayer>> {
  const importName = `${type}LayerState`;
  const module = await import(`./${type}/state/layer.ts`);
  return module[importName];
}
