import { useAtom } from 'jotai';

import { NETWORKS_METADATA } from 'data-layers/networks/metadata';
import { ParamChecklist } from 'lib/controls/params/ParamChecklist';
import { LayerLabel } from 'lib/sidebar/ui/LayerLabel';

import { buildingSelectionState } from '../state/data-selection';

export const BuildingsControl = () => {
  const [checkboxState, setCheckboxState] = useAtom(buildingSelectionState);

  return (
    <ParamChecklist
      title="Building types"
      options={Object.keys(checkboxState)}
      checklistState={checkboxState}
      onChecklistState={setCheckboxState}
      renderLabel={(key) => <LayerLabel {...NETWORKS_METADATA[key]} visible={checkboxState[key]} />}
    />
  );
};
