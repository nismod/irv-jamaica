import { StoryObj, Meta } from '@storybook/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { selectionState } from 'lib/state/interactions/interaction-state';
import mockTerrestrialFeature from 'mocks/details/solutions/mockTerrestrialFeature.json';
import mockMarineFeature from 'mocks/details/solutions/mockMarineFeature.json';
import { SolutionsSidebar } from './SolutionsSidebar';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

function dataLoaderDecorator(Story, { args }) {
  const [, setFeatureSelection] = useRecoilState(selectionState('solutions'));
  const mockSelection = {
    interactionGroup: 'solutions',
    interactionStyle: 'vector',
    target: {
      feature: args.feature,
    },
    viewLayer: {
      id: args.id,
      group: null,
      fn: () => {},
    },
  };
  useEffect(() => {
    setFeatureSelection(mockSelection);
  }, []);

  return <Story />;
}

const meta = {
  title: 'Details/SolutionsSidebar',
  component: SolutionsSidebar,
  decorators: [fixedWidthDecorator, dataLoaderDecorator],
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
