import { StoryObj, Meta } from '@storybook/react';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

import { selectionState } from 'lib/state/interactions/interaction-state';
import mockRegion from 'mocks/details/regions/mockRegion.json';
import { RegionDetails } from './RegionDetails';

function FixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

function DataLoaderDecorator(Story, { args }) {
  const [, setRegionSelection] = useRecoilState(selectionState('regions'));
  useEffect(() => {
    setRegionSelection(args.region);
  }, [args.region, setRegionSelection]);

  return <Story />;
}
const meta = {
  title: 'Details/RegionDetails',
  component: RegionDetails,
  decorators: [FixedWidthDecorator, DataLoaderDecorator],
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    region: mockRegion,
  },
};
