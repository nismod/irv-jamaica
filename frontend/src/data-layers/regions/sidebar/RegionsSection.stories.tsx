import { StoryObj, Meta } from '@storybook/react';

import { atom, RecoilRoot } from 'recoil';
import { useSyncRecoilState } from 'lib/recoil/sync-state';
import { viewStateEffect } from 'state/view';
import { useStateEffect } from 'lib/recoil/state-effects/use-state-effect';

import { RegionsSection } from './RegionsSection';

function recoilDecorator(Story) {
  return (
    <RecoilRoot>
      <Story />
    </RecoilRoot>
  );
}

function fixedWidthDecorator(Story) {
  return (
    <div style={{ width: '300px' }}>
      <Story />
    </div>
  );
}

const mockViewState = atom({
  key: 'mockViewState',
  default: 'exposure',
});

function SectionStyle({ children, view }) {
  useSyncRecoilState(mockViewState, view);
  useStateEffect(mockViewState, viewStateEffect);
  return children;
}

const meta = {
  title: 'Sidebar/RegionsSection',
  component: RegionsSection,
  decorators: [fixedWidthDecorator, recoilDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <SectionStyle view="exposure">
        <Story />
      </SectionStyle>
    ),
  ],
};
