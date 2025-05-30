import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { TerrestrialSection } from './TerrestrialSection';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Sidebar/TerrestrialSection',
  component: TerrestrialSection,
  decorators: [fixedWidthDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    view: 'nature-based-solutions',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Terrestrial')).toBeTruthy();
  },
};
