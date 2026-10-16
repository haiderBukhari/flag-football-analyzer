import type { Meta, StoryObj } from '@storybook/react-vite';

import CsvPreview from '.';

const meta: Meta<typeof CsvPreview> = {
  title: 'Features / Game Footage / Components / Csv Preview',
  component: CsvPreview,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj<typeof CsvPreview>;

export const Default: Story = {
  args: {
    segments: [
      { id: '1', start: 10, end: 25, duration: 15, playType: 'Pass', tags: ['Red Zone', 'Blitz'] },
      { id: '2', start: 42, end: 83, duration: 41, playType: 'Run', tags: [] },
    ],
  },
};

export const Empty: Story = {
  args: { segments: [] },
};

export const Loading: Story = {
  args: { segments: [] },
  parameters: { noTranslations: true },
};
