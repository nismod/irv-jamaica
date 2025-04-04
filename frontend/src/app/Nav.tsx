import Menu from '@mui/icons-material/Menu';
import {
  AppBar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Link as MuiLink,
  LinkProps,
  Toolbar,
  Tooltip,
  styled,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC, forwardRef, useCallback, useState } from 'react';
import { NavLink as RouterNavLink, LinkProps as RouterLinkProps } from 'react-router-dom';

import { VIEW_SECTIONS } from 'app/config/views';
import { useIsMobile } from './use-is-mobile';
import { withProps } from 'lib/react/with-props';
import { mapLatUrlState, mapLonUrlState, mapZoomUrlState } from 'lib/state/map-view/map-url';
import { globalStyleVariables } from 'app/theme';
import { useRecoilValue } from 'recoil';

const Link = styled(MuiLink)({
  color: 'inherit',
  textDecoration: 'none',
});

const DrawerLink = styled(Link)({
  height: '100%',
  width: '100%',
  padding: '0.5rem 1rem',
  '&.active': {
    backgroundColor: '#eeeeee',
  },
});

const ToolbarLink = styled(Link)({
  padding: '0 3px 1px 3px',
  margin: '0 9px -10px 9px',
  borderBottom: '6px solid transparent',
  '&:hover,&:focus': {
    borderBottomColor: '#ffffffbc',
  },
  '&:active,&.active': {
    borderBottomColor: '#ffffff',
  },
});

function useMapQueryParams() {
  const lat = useRecoilValue(mapLatUrlState).toFixed(5);
  const lon = useRecoilValue(mapLonUrlState).toFixed(5);
  const zoom = useRecoilValue(mapZoomUrlState).toFixed(2);
  const url = new URL(window.location.href);
  url.searchParams.set('lat', lat);
  url.searchParams.set('lon', lon);
  url.searchParams.set('zoom', zoom);
  // ignore user settings for assetsStyle, marine, and terrestrial parameters.
  ['assetsStyle', 'marine', 'terrestrial'].forEach((param) => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
    }
  });
  return url.searchParams;
}

const mapPages = Object.keys(VIEW_SECTIONS).map((view) => `/${view}`);

const ToolbarLinkWithRef = (props, ref) => {
  const mapParams = useMapQueryParams();
  const { to, ...rest } = props;
  const pageLink = mapPages.includes(to) ? `${to}?${mapParams}` : to;
  return <ToolbarLink component={RouterNavLink} ref={ref} to={pageLink} {...rest} />;
};
const ToolbarNavLink = forwardRef<HTMLAnchorElement, LinkProps & RouterLinkProps>(
  ToolbarLinkWithRef,
);

const DrawerLinkWithRef = (props, ref) => {
  const mapParams = useMapQueryParams();
  const { to, ...rest } = props;
  const pageLink = mapPages.includes(to) ? `${to}?${mapParams}` : to;
  return <DrawerLink component={RouterNavLink} ref={ref} to={pageLink} {...rest} />;
};
const DrawerNavLink = forwardRef<HTMLAnchorElement, LinkProps & RouterLinkProps>(DrawerLinkWithRef);

const GrowingDivider = styled(Divider)({
  flexGrow: 1,
});

const drawerWidth = globalStyleVariables.mobileDrawerWidth;
const MobileDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
});

const NavTooltip = withProps(Tooltip, {
  enterDelay: 500,
  disableInteractive: true,
});

const MobileNavContent: FC<{ navItems: NavItemConfig[] }> = ({ navItems }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <IconButton color="inherit" onClick={() => setDrawerOpen((open) => !open)} title="Menu">
        <Menu />
      </IconButton>

      <ToolbarNavLink to="/" onClick={closeDrawer}>
        J-SRAT
      </ToolbarNavLink>

      <GrowingDivider />

      <MobileDrawer open={drawerOpen} onClose={closeDrawer}>
        <Toolbar /> {/* Prevents app bar from concealing content*/}
        <List>
          <ListItem disablePadding>
            <DrawerNavLink to="/" onClick={closeDrawer}>
              Home
            </DrawerNavLink>
          </ListItem>
          {navItems.map(({ to, title, tooltip }) => (
            <NavTooltip key={to} title={tooltip} placement="right">
              <ListItem disablePadding>
                <DrawerNavLink to={to} onClick={closeDrawer}>
                  {title}
                </DrawerNavLink>
              </ListItem>
            </NavTooltip>
          ))}
        </List>
      </MobileDrawer>
    </>
  );
};

const DesktopNavContent: FC<{ navItems: NavItemConfig[] }> = ({ navItems }) => (
  <>
    <ToolbarNavLink to="/">J-SRAT</ToolbarNavLink>

    {navItems.map(({ to, title, tooltip }) => (
      <NavTooltip key={to} title={tooltip} placement="bottom">
        <ToolbarNavLink to={to}>{title}</ToolbarNavLink>
      </NavTooltip>
    ))}
  </>
);

const topStripeHeight = 6;

export interface NavItemConfig {
  to: string;
  title: string;
  tooltip?: string;
}

/**
 * Client-side navigation for both mobile and desktop viewports.
 * Stores a subset of map layer state in the map view URLs.
 */
export const Nav: FC<{ height: number; navItems: NavItemConfig[] }> = ({ height, navItems }) => {
  const isMobile = useIsMobile();

  return (
    <AppBar position="fixed" sx={{ color: 'white' }}>
      <Box height={topStripeHeight} width="100%" bgcolor="rgb(197,206,0)" />
      <Toolbar
        variant="dense"
        sx={{
          backgroundColor: 'rgb(0,126,133)',
          height: height - topStripeHeight,
        }}
      >
        {isMobile ? (
          <MobileNavContent navItems={navItems} />
        ) : (
          <DesktopNavContent navItems={navItems} />
        )}
      </Toolbar>
    </AppBar>
  );
};
