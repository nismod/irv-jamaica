import { useAtom } from 'jotai';

import { HAZARD_DOMAINS } from 'data-layers/hazards/domains';
import { NETWORK_DOMAINS } from 'data-layers/networks/domains';
import { RISK_DOMAINS } from 'data-layers/risks/domains';

import { DataParamGroupConfig } from 'lib/controls/data-params';
import { syncExternalConfigState } from 'lib/state/data-params';

export const dataParamConfig: Record<string, DataParamGroupConfig> = {
  ...HAZARD_DOMAINS,
  ...NETWORK_DOMAINS,
  risks: RISK_DOMAINS,
};

export function useSyncConfigState() {
  const [config, setConfig] = useAtom(syncExternalConfigState);
  if (config !== dataParamConfig) {
    setConfig(dataParamConfig);
  }
}
