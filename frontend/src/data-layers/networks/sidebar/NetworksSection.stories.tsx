import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

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
  argTypes: {
    view: {
      control: {
        type: 'select',
      },
      options: ['exposure', 'risk', 'adaptation'],
    },
  },
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Exposure: Story = {
  args: {
    view: 'exposure',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Infrastructure')).toBeTruthy();
    expect(
      canvas.queryByText(
        'Infrastructure layers are currently following the Adaptation Options selection',
      ),
    ).toBeFalsy();
  },
};

export const Risk: Story = {
  args: {
    view: 'risk',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Infrastructure')).toBeTruthy();
    expect(
      canvas.queryByText(
        'Infrastructure layers are currently following the Adaptation Options selection',
      ),
    ).toBeFalsy();
  },
};

export const Adaptation: Story = {
  args: {
    view: 'adaptation',
  },
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText('Infrastructure')).toBeTruthy();
    expect(
      canvas.queryByText(
        'Infrastructure layers are currently following the Adaptation Options selection',
      ),
    ).toBeTruthy();
  },
};
