import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import { useHydrateAtoms } from 'jotai/utils';

import mockPixelData from 'mocks/details/pixel-data/mockPixelData.json';
import { pixelSelectionState } from 'lib/state/pixel-driller';
import { PixelData } from './PixelData';

function FixedWidthDecorator(Story) {
  useHydrateAtoms([[pixelSelectionState, { lat: -78, lon: 18 }]]);
  return (
    <div style={{ width: '60ch' }}>
      <Story />
    </div>
  );
}

const meta = {
  title: 'Details/PixelData',
  component: PixelData,
  decorators: [FixedWidthDecorator],
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/pixel/18.000/-78.000', () => {
          return HttpResponse.json(mockPixelData);
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(await canvas.findByText('River flooding: depth (m)')).toBeTruthy();
    expect(await canvas.findByText('Surface flooding: depth (m)')).toBeTruthy();
    expect(await canvas.findByText('Coastal flooding: depth (m)')).toBeTruthy();
    expect(await canvas.findByText('Cyclones: speed (m s-1)')).toBeTruthy();

    const floodingAccordion = await canvas.findByRole('button', { name: /River flooding/ });
    expect(floodingAccordion).toBeTruthy();
    floodingAccordion.click();
    const toggleButton = await canvas.findByRole('button', { name: /2010/ });
    expect(toggleButton).toBeTruthy();
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
  },
};
