import { StoryObj, Meta } from '@storybook/react';
import { http, HttpResponse, delay } from 'msw';

import { FeatureSidebarContent } from './FeatureSidebarContent';
import mockFeature from 'mocks/details/features/mockFeature.json';
import mockFeatureDetails from 'mocks/details/features/mockFeatureDetails.json';

const meta = {
  title: 'Details/FeatureSidebarContent',
  component: FeatureSidebarContent,
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    feature: mockFeature,
    assetType: 'road_edges_class_b',
    showRiskSection: true,
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
