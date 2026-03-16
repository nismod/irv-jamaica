import { useAtom } from 'jotai';

import { NETWORKS_METADATA } from 'data-layers/networks/metadata';
import { ParamChecklist } from 'lib/controls/params/ParamChecklist';
import { LayerLabel } from 'lib/sidebar/ui/LayerLabel';

import { buildingSelectionState, BuildingSelection } from '../state/data-selection';

type AtomSetter<T> = (value: T | ((prev: T) => T)) => void;

export const BuildingsControl = () => {
  const [checkboxState, setCheckboxState] = useAtom(buildingSelectionState as never) as [BuildingSelection, AtomSetter<BuildingSelection>];

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
