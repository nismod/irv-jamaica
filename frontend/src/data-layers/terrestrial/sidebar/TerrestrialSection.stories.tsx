import { StoryObj, Meta } from '@storybook/react';

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
};
