import { StoryObj, Meta } from '@storybook/react';
import { http, HttpResponse, delay } from 'msw';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { selectionState } from 'lib/state/interactions/interaction-state';
import mockFeature from 'mocks/details/features/mockFeature.json';
import mockFeatureDetails from 'mocks/details/features/mockFeatureDetails.json';
import { FeatureSidebar } from './FeatureSidebar';

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '45ch' }}>
      <Story />
    </div>
  );
}

function dataLoaderDecorator(Story, { args }) {
  const [, setFeatureSelection] = useRecoilState(selectionState('assets'));
  const mockSelection = {
    interactionGroup: 'assets',
    interactionStyle: 'vector',
    target: {
      feature: args.feature,
    },
    viewLayer: {
      id: args.id,
      group: 'networks',
      fn: () => {},
    },
  };

  useEffect(() => {
    setFeatureSelection(mockSelection);
  }, []);

  return <Story />;
}

const meta = {
  title: 'Details/FeatureSidebar',
  component: FeatureSidebar,
  decorators: [fixedWidthDecorator, dataLoaderDecorator],
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feature: mockFeature,
    id: 'road_edges_class_b',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/api/features/1000036526', () => {
          return HttpResponse.json(mockFeatureDetails);
        }),
      ],
    },
  },
};
