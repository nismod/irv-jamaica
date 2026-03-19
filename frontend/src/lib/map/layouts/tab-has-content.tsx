import { useEffect } from 'react';
import { atom, useSetAtom } from 'jotai';
import { atomFamily } from 'jotai-family';

export const mobileTabHasContentState = atomFamily(() => atom(false));

/**
 * Use this component to indicate that a tab in the mobile UI version has content.
 * The `tabId` should match one of the `id` fields in `mobileTabsConfig` in this file.
 */
export const MobileTabContentWatcher = ({ tabId }) => {
  const setTabHasContent = useSetAtom(mobileTabHasContentState(tabId));

  useEffect(() => {
    setTabHasContent(true);

    return () => {
      setTabHasContent(false);
    };
  }, [setTabHasContent]);

  return null;
};
