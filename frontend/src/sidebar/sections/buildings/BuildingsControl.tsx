import { useRecoilState } from 'recoil';

import { buildingSelectionState } from 'data-layers/buildings/data-selection';
import { NETWORKS_METADATA } from 'data-layers/networks/metadata';
import { ParamChecklist } from 'lib/controls/params/ParamChecklist';
import { LayerLabel } from 'sidebar/ui/LayerLabel';

export const BuildingsControl = () => {
  const [checkboxState, setCheckboxState] = useRecoilState(buildingSelectionState);

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
