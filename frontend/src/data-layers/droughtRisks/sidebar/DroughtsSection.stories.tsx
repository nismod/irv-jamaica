import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { DroughtsSection } from './DroughtsSection';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Sidebar/DroughtsSection',
  component: DroughtsSection,
  decorators: [fixedWidthDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    view: 'adaptation',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Drought')).toBeTruthy();
  },
};
