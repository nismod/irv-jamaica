import { StoryObj, Meta } from '@storybook/react-vite';
import { DataPage } from './DataPage';

const meta = {
  title: 'App/DataPage',
  component: DataPage,
} as Meta;
type Story = StoryObj<typeof meta>;

export default meta;

export const Default: Story = {};
