import { StoryObj, Meta } from '@storybook/react';

import mockRegion from 'mocks/details/regions/mockRegion.json';
import { RegionDetailsContent } from './RegionDetailsContent';

const meta = {
  title: 'Details/RegionDetailsContent',
  component: RegionDetailsContent,
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedRegion: mockRegion,
  },
};
