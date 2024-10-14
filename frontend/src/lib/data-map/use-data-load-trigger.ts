import difference from 'lodash/difference';
import { useEffect, useState } from 'react';

import { DataLoader } from '../data-loader/data-loader';
import { usePrevious } from '../hooks/use-previous';

const DEFAULT_LOADERS: DataLoader[] = [];

/**
 * Based on a list of data loaders extracted from view layers,
 * returns a number which can be used as a trigger to recalculate a list of deck layers.
 *
 */
export function useDataLoadTrigger(dataLoaders: DataLoader[]) {
  const [trigger, setTrigger] = useState(0);
  const previousLoaders = usePrevious(dataLoaders) ?? DEFAULT_LOADERS;
  const removedLoaders = difference(previousLoaders, dataLoaders);
  const addedLoaders = difference(dataLoaders, previousLoaders);

  useEffect(() => {
    function incrementTrigger() {
      setTrigger((trigger) => trigger + 1);
    }
    // destroy removed data loaders to free up memory
    removedLoaders.forEach((dl) => dl.destroy());

    // subscribe to new data loaders to trigger an update to the data map when data is loaded
    addedLoaders.forEach((dl) => dl.subscribe(incrementTrigger));

    // if there was a change in data loaders, trigger an update to the data map
    if (addedLoaders.length > 0 || removedLoaders.length > 0) {
      incrementTrigger();
    }
  }, [addedLoaders, removedLoaders]);

  /* store current value of dataLoaders so that we can clean up data on component unmount
   * this is necessary because we don't want to keep the data loaders around after the component is unmounted
   */
  useEffect(() => {
    return () => {
      previousLoaders?.forEach((dl) => dl.destroy());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return trigger;
}
