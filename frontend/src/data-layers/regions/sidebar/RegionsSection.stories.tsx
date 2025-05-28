import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { RegionsSection } from './RegionsSection';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Sidebar/RegionsSection',
  component: RegionsSection,
  decorators: [fixedWidthDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    view: 'exposure',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Regions')).toBeTruthy();
  },
};
