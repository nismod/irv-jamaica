import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { BuildingsSection } from './BuildingsSection';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Sidebar/BuildingsSection',
  component: BuildingsSection,
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
    expect(canvas.queryByText('Buildings')).toBeTruthy();
  },
};
