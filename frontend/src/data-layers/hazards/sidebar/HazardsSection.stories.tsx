import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { HazardsSection } from './HazardsSection';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Sidebar/HazardsSection',
  component: HazardsSection,
  decorators: [fixedWidthDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Exposure: Story = {
  args: {
    view: 'exposure',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Hazards')).toBeTruthy();
  },
};

export const Risk: Story = {
  args: {
    view: 'risk',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Hazards')).toBeTruthy();
  },
};
