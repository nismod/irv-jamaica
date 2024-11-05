import { StoryObj, Meta } from '@storybook/react';
import { expect, within } from '@storybook/test';

import { RisksSection } from './RisksSection';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Sidebar/RisksSection',
  component: RisksSection,
  decorators: [fixedWidthDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    view: 'risk',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Aggregated Risk')).toBeTruthy();
  },
};
