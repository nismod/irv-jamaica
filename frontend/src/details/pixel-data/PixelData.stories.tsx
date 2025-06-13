import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';

import mockPixelData from 'mocks/details/pixel-data/mockPixelData.json';
import { PixelData } from './PixelData';

function FixedWidthDecorator(Story) {
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
        http.get('/pixel/0.000/0.000', () => {
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
    const grids = await canvas.findAllByRole('grid');
    expect(grids).toHaveLength(4);
    grids.forEach((grid) => {
      const rowGroup = within(grid).getByRole('rowgroup');
      expect(rowGroup).toBeTruthy();
      const rows = within(rowGroup).getAllByRole('row');
      expect(rows.length).toBeGreaterThan(0);
    });
  },
};
