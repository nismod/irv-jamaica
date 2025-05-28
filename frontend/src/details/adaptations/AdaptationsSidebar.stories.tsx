import { StoryObj, Meta } from '@storybook/react-vite';

import { AdaptationsSidebar } from './AdaptationsSidebar';
import { http, HttpResponse } from 'msw';
import mockItemSearch from 'mocks/details/adaptations/mockItemSearch.json';
import mockItem from 'mocks/details/adaptations/mockItem.json';

const API_SEARCH_PATH =
  location.hostname === 'nismod.github.io'
    ? '/irv-jamaica/api/features/sorted-by/adaptation'
    : '/api/features/sorted-by/adaptation';

const meta = {
  title: 'Details/AdaptationsSidebar',
  component: AdaptationsSidebar,
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(API_SEARCH_PATH, ({ request }) => {
          const url = new URL(request.url);
          if (
            url.searchParams.get('sector') === 'power' &&
            url.searchParams.get('field') === 'avoided_ead_mean' &&
            url.searchParams.get('dimensions') ===
              '{"hazard":"TC","rcp":"4.5","adaptation_name":"Upgrade wooden poles to steel","adaptation_protection_level":0.76}'
          ) {
            return HttpResponse.json(mockItemSearch);
          }
          return new HttpResponse(null, { status: 404 });
        }),
        http.get(/\/api\/features\/\d+/, () => {
          return HttpResponse.json(mockItem);
        }),
      ],
    },
  },
};
