import { TabContext, useTabContext } from '@mui/lab';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';
import {
  ComponentProps,
  FC,
  RefObject,
  Suspense,
  cloneElement,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Drawer } from 'vaul';
import { useAtomValue } from 'jotai';

import { mobileTabHasContentState } from 'lib/map/layouts/tab-has-content';

import { MapView } from 'app/map/MapView';

import { TabConfig, mobileTabsConfig } from './tabs-config';

const bottomNavigationHeightPx = 56;
const handleMarginBlockPx = 15;
const bottomSheetHandleHeightPx = 2 * handleMarginBlockPx + 5;

type SnapPoint = string | number;

/**
 * Custom BottomNavigationAction that gets disabled if the corresponding tab doesn't have any content.
 *
 */
const TabNavigationAction: FC<{
  value: string;

  label: TabConfig['label'];
  IconComponent: TabConfig['IconComponent'];

  selected?: boolean;
  showLabel?: boolean;
  onChange?: ComponentProps<typeof BottomNavigationAction>['onChange'];
}> = ({ value, label, IconComponent, selected, showLabel, onChange }) => {
  const hasContent = useAtomValue(mobileTabHasContentState(value));
  const disabled = !hasContent;

  // cloneElement is needed here because MUI BottomNavigation uses Children.map and cloneElement
  // and expects the children to be BottomNavigationActions, so this component needs to adapt to that
  // see @mui/material/BottomNavigation/BottomNavigation.js#L64
  return cloneElement(
    <BottomNavigationAction
      value={value}
      label={label}
      icon={<IconComponent fontSize="small" />}
      disabled={disabled}
      sx={
        selected
          ? undefined
          : {
              '&.Mui-disabled': {
                color: '#b2b2b2',
              },
            }
      }
      showLabel={showLabel}
      onChange={onChange}
    />,
    {
      selected,
    },
  );
};

/**
 * TabPanel that doesn't unmount inactive tabs, only uses display:none
 */
const NonUnmountingTabPanel = ({ value, children }) => {
  const context = useTabContext();

  return <Box display={value === context?.value ? 'block' : 'none'}>{children}</Box>;
};

const MobileTabPanel: FC<{ tabConfig: TabConfig }> = ({ tabConfig: { id, ContentComponent } }) => (
  <NonUnmountingTabPanel value={id}>
    <Box m={2}>
      <ContentComponent />
    </Box>
  </NonUnmountingTabPanel>
);

export const MapPageMobileLayout = () => {
  const [bottomTabId, setBottomTabId] = useState('layers');
  const scrollRef = useRef<HTMLDivElement>(null);
  usePreventOverscroll(scrollRef);

  const snapPoints: SnapPoint[] = [
    `${bottomNavigationHeightPx + bottomSheetHandleHeightPx}px`,
    0.35,
    0.5,
    0.9, // calculation not supported here so leave roughly 10% for header
  ];

  const [activeSnapPoint, setActiveSnapPoint] = useState(snapPoints[1]);

  const scrollAreaHeight = `calc(100dvh - var(--snap-point-height) - ${bottomSheetHandleHeightPx + bottomNavigationHeightPx}px)`;

  return (
    <>
      <Box position="absolute" overflow="clip" top={0} left={0} right={0} bottom={0}>
        <MapView />
      </Box>
      <Drawer.Root
        defaultOpen={true}
        modal={false}
        dismissible={false}
        snapPoints={snapPoints}
        activeSnapPoint={activeSnapPoint}
        setActiveSnapPoint={setActiveSnapPoint}
        snapToSequentialPoint={false}
        handleOnly={true}
      >
        <Drawer.Portal>
          <Drawer.Content asChild={true}>
            <Box position="fixed" zIndex={1001} bottom={0} left={0} right={0}>
              <Paper
                elevation={3}
                square={true}
                sx={{
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                }}
              >
                <Box pt={0.1} height="100dvh">
                  <Drawer.Handle
                    style={{ marginBlock: `${handleMarginBlockPx}px`, width: '150px' }}
                  />
                  <div
                    style={{
                      height: scrollAreaHeight,
                      minHeight: scrollAreaHeight,
                      maxHeight: scrollAreaHeight,
                    }}
                  >
                    <div
                      ref={scrollRef}
                      style={{
                        overflowY: 'scroll',
                        height: '100%',
                        overscrollBehavior: 'contain',
                      }}
                    >
                      <TabContext value={bottomTabId}>
                        {mobileTabsConfig.map((tabConfig) => (
                          <Suspense key={tabConfig.id} fallback={null}>
                            <MobileTabPanel tabConfig={tabConfig} />
                          </Suspense>
                        ))}
                      </TabContext>
                    </div>
                  </div>
                  <BottomNavigation
                    value={bottomTabId}
                    onChange={(event, newValue) => setBottomTabId(newValue)}
                    showLabels={true}
                  >
                    {mobileTabsConfig.map(({ id, label, IconComponent }) => (
                      <TabNavigationAction
                        key={id}
                        value={id}
                        label={label}
                        IconComponent={IconComponent}
                        selected={bottomTabId === id}
                        showLabel={true}
                      />
                    ))}
                  </BottomNavigation>
                </Box>
              </Paper>
            </Box>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

/** Used to prevent pull-to-refresh gesture on mobile drawer when the drawer content is not scrollable
 * (because in those cases overscrollBehavior CSS property doesn't work)
 */
const usePreventOverscroll = (scrollRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const isAtTop = scrollContainer.scrollTop === 0;

      const currentY = e.touches[0].clientY;
      const isSwipingDown = currentY > startY; // User is pulling down

      if (isAtTop && isSwipingDown) {
        e.preventDefault(); // Fully block pull-to-refresh
      }
    };

    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [scrollRef]);
};
