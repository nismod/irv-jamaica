import { NETWORKS_METADATA } from 'data-layers/networks/metadata';
import { ParamChecklist } from 'lib/controls/params/ParamChecklist';
import { useRecoilState } from 'recoil';
import { LayerLabel } from 'sidebar/ui/LayerLabel';
import { buildingSelectionState } from 'state/data-selection/buildings';

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
