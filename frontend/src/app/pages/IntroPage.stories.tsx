import { StoryObj, Meta } from '@storybook/react';
import { IntroPage } from './IntroPage';

const meta = {
  title: 'App/IntroPage',
  component: IntroPage,
} as Meta;
type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
