import Layers from '@mui/icons-material/Layers';
import Palette from '@mui/icons-material/Palette';
import TableRows from '@mui/icons-material/TableRows';
import { SvgIconProps } from '@mui/material';
import { ComponentType } from 'react';
import { useAtomValue } from 'jotai';

import { MapLegend } from 'lib/map/legend/MapLegend';

import { damageSourceState } from 'lib/state/damage-map';
import { LayersSidebar } from 'app/sidebar/SidebarContent';
import { DetailsSidebar } from 'details/DetailsSidebar';

// Wrapper component for mobile MapLegend that provides the currentHazard prop
const MapLegendWithHazard = () => {
  const currentHazard = useAtomValue(damageSourceState);
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
