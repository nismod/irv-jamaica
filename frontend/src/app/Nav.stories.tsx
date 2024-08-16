import { StoryObj, Meta } from '@storybook/react';
import { navItems } from 'App';
import { Nav } from './Nav';

const meta = {
  title: 'App/Nav',
  component: Nav,
} as Meta;
type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {
  args: {
    navItems,
  },
};
