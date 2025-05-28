import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { selectionState } from 'lib/state/interactions/interaction-state';
import mockTerrestrialFeature from 'mocks/details/solutions/mockTerrestrialFeature.json';
import mockMarineFeature from 'mocks/details/solutions/mockMarineFeature.json';
import { SolutionsSidebar } from './SolutionsSidebar';
import { Layer } from 'deck.gl';

function FixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

function DataLoaderDecorator(Story, { args }) {
  const { feature, id } = args;
  const [, setFeatureSelection] = useRecoilState(selectionState('solutions'));

  useEffect(() => {
    const mockSelection = {
      interactionGroup: 'solutions',
      interactionStyle: 'vector',
      target: {
        feature: feature,
      },
      viewLayer: {
        id: id,
        group: null,
        fn: () => ({}) as Layer,
      },
    };
    setFeatureSelection(mockSelection);
  }, [feature, id, setFeatureSelection]);

  return <Story />;
}

const meta = {
  title: 'Details/SolutionsSidebar',
  component: SolutionsSidebar,
  decorators: [FixedWidthDecorator, DataLoaderDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Terrestrial: Story = {
  args: {
    feature: mockTerrestrialFeature,
    id: 'terrestrial',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Terrestrial');
    expect(canvas.queryByText('Cell ID')).toBeTruthy();
    expect(canvas.queryByText('Land Use')).toBeTruthy();
    expect(canvas.queryByText('Slope (deg)')).toBeTruthy();
    expect(canvas.queryByText('Elevation (m)')).toBeTruthy();
  },
};

export const Marine: Story = {
  args: {
    feature: mockMarineFeature,
    id: 'marine',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Marine');
    expect(canvas.queryByText('Habitat')).toBeTruthy();
    expect(canvas.queryByText('Mangrove Type')).toBeTruthy();
    expect(canvas.queryByText('Proximity')).toBeTruthy();
  },
};
