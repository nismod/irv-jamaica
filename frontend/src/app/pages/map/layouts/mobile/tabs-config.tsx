import Layers from '@mui/icons-material/Layers';
import Palette from '@mui/icons-material/Palette';
import TableRows from '@mui/icons-material/TableRows';
import { SvgIconProps } from '@mui/material';
import { ComponentType } from 'react';
import { useRecoilValue } from 'recoil';

import { MapLegend } from 'lib/map/legend/MapLegend';

import { damageSourceState } from 'app/state/damage-mapping/damage-map';
import { LayersSidebar } from 'app/sidebar/SidebarContent';
import { DetailsSidebar } from 'details/DetailsSidebar';

// Wrapper component for mobile MapLegend that provides the currentHazard prop
const MapLegendWithHazard = () => {
  const currentHazard = useRecoilValue(damageSourceState);
  return <MapLegend currentHazard={currentHazard} />;
};

export interface TabConfig {
  id: string;
  label: string;
  IconComponent: ComponentType<SvgIconProps>;
  ContentComponent: ComponentType;
}

/**
 *
 */
export const mobileTabsConfig: TabConfig[] = [
  {
    id: 'layers',
    label: 'Layers',
    IconComponent: Layers,
    ContentComponent: LayersSidebar,
  },
  {
    id: 'legend',
    label: 'Legend',
    IconComponent: Palette,
    ContentComponent: MapLegendWithHazard,
  },
  {
    id: 'details',
    label: 'Selection',
    IconComponent: TableRows,
    ContentComponent: DetailsSidebar,
  },
];
