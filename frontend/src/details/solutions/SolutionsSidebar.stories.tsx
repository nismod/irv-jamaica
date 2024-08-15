import { StoryObj, Meta } from '@storybook/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { selectionState } from 'lib/state/interactions/interaction-state';
import mockTerrestrialFeature from 'mocks/details/solutions/mockTerrestrialFeature.json';
import mockMarineFeature from 'mocks/details/solutions/mockMarineFeature.json';
import { SolutionsSidebar } from './SolutionsSidebar';

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
        fn: () => {},
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
};

export const Marine: Story = {
  args: {
    feature: mockMarineFeature,
    id: 'marine',
  },
};
