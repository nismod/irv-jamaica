import { StoryObj, Meta } from '@storybook/react';

import mockTerrestrialFeature from 'mocks/details/solutions/mockTerrestrialFeature.json';
import mockMarineFeature from 'mocks/details/solutions/mockMarineFeature.json';
import { SolutionsSidebarContent } from './SolutionsSidebarContent';

const meta = {
  title: 'Details/SolutionsSidebarContent',
  component: SolutionsSidebarContent,
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Terrestrial: Story = {
  args: {
    feature: mockTerrestrialFeature,
    solutionType: 'terrestrial',
    showRiskSection: true,
  },
};

export const Marine: Story = {
  args: {
    feature: mockMarineFeature,
    solutionType: 'marine',
    showRiskSection: true,
  },
};
