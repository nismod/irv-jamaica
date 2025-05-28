import { StoryObj, Meta } from '@storybook/react-vite';
import { GuidePage } from './GuidePage';

const meta = {
  title: 'App/GuidePage',
  component: GuidePage,
} as Meta;
type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
