import { useAtomValue } from 'jotai';
import { dataParamOptionsState, dataParamState, useUpdateDataParam } from 'lib/state/data-params';

export const DataParam = ({ group, id, children }) => {
  const value = useAtomValue(dataParamState({ group, param: id }));
  const updateValue = useUpdateDataParam(group, id);
  const options = useAtomValue(dataParamOptionsState({ group, param: id }));

  return typeof children === 'function'
    ? children({ value: value, onChange: updateValue, options })
    : children;
};
