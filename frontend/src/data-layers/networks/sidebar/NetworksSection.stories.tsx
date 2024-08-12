import { StoryObj, Meta } from '@storybook/react';

import { NetworksSection } from './NetworksSection';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Sidebar/NetworksSection',
  component: NetworksSection,
  decorators: [fixedWidthDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Exposure: Story = {
  args: {
    view: 'exposure',
  },
};

export const Risk: Story = {
  args: {
    view: 'risk',
  },
};

export const Adaptation: Story = {
  args: {
    view: 'adaptation',
  },
};
