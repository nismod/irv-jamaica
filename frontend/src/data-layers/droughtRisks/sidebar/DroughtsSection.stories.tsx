import { StoryObj, Meta } from '@storybook/react';

import { atom, RecoilRoot } from 'recoil';
import { useSyncRecoilState } from 'lib/recoil/sync-state';
import { viewStateEffect } from 'state/view';
import { useStateEffect } from 'lib/recoil/state-effects/use-state-effect';

import { DroughtsSection } from './DroughtsSection';

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
  default: 'adaptation',
});

function SectionStyle({ children, view }) {
  useSyncRecoilState(mockViewState, view);
  useStateEffect(mockViewState, viewStateEffect);
  return children;
}

const meta = {
  title: 'Sidebar/DroughtsSection',
  component: DroughtsSection,
  decorators: [fixedWidthDecorator, recoilDecorator],
} as Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <SectionStyle view="adaptation">
        <Story />
      </SectionStyle>
    ),
  ],
};
