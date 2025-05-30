import { StoryObj, Meta } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { selectionState } from 'lib/state/interactions/interaction-state';
import mockFeature from 'mocks/details/features/mockFeature.json';
import mockFeatureDetails from 'mocks/details/features/mockFeatureDetails.json';
import { FeatureSidebar } from './FeatureSidebar';
import { Layer } from 'deck.gl';

function FixedWidthDecorator(Story) {
  return (
    <div style={{ width: '45ch' }}>
      <Story />
    </div>
  );
}

function DataLoaderDecorator(Story, { args }) {
  const [, setFeatureSelection] = useRecoilState(selectionState('assets'));

  useEffect(() => {
    const mockSelection = {
      interactionGroup: 'assets',
      interactionStyle: 'vector',
      target: {
        feature: args.feature,
      },
      viewLayer: {
        id: args.id,
        group: 'networks',
        fn: () => ({}) as Layer,
      },
    };
    setFeatureSelection(mockSelection);
  }, [setFeatureSelection, args]);

  return <Story />;
}

const meta = {
  title: 'Details/FeatureSidebar',
  component: FeatureSidebar,
  decorators: [FixedWidthDecorator, DataLoaderDecorator],
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Roads (Class B)');
    expect(await canvas.findByText('Risk')).toBeTruthy();
    expect(await canvas.findByText('Return Period Damages')).toBeTruthy();
    expect(await canvas.findByText('Adaptation Options')).toBeTruthy();
  },
};
