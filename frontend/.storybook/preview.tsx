import * as React from 'react';
import type { Preview } from '@storybook/react';
import { atom, RecoilRoot } from 'recoil';
import { useSyncRecoilState } from '../src/lib/recoil/sync-state';
import { viewStateEffect } from '../src/app/state/view';
import { useStateEffect } from '../src/lib/recoil/state-effects/use-state-effect';

const mockViewState = atom({
  key: 'mockViewState',
  default: 'exposure',
});

function SectionStyle({ children, view }) {
  useSyncRecoilState(mockViewState, view);
  useStateEffect(mockViewState, viewStateEffect);
  return children;
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, { args }) => (
      <RecoilRoot>
        <SectionStyle view={args.view}>
          <Story />
        </SectionStyle>
      </RecoilRoot>
    ),
  ],
};

export default preview;
