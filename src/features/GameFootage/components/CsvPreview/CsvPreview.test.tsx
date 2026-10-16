import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { type Segment } from '../../../../redux/SegmentSlice';
import { segmentsToCsv } from '../../../../utils/exportSegments';
import CsvPreview from '.';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const SEGMENTS: Segment[] = [
  { id: 'a', start: 1, end: 5, duration: 4, playType: 'Pass', tags: ['x', 'y'] },
  { id: 'b', start: 6, end: 9, duration: 3 },
];

function readTable() {
  const rows = screen.getAllByRole('row').map((row) =>
    [...row.querySelectorAll('th, td')].map((cell) => cell.textContent));

  return rows;
}

describe('CsvPreview', () => {
  it('matches the exported CSV header, order and values', () => {
    render(<CsvPreview segments={SEGMENTS} />);

    const expected = segmentsToCsv(SEGMENTS).split('\n').map((line) => line.split(','));

    expect(readTable()).toEqual(expected);
  });

  it('updates when segments change', () => {
    const { rerender } = render(<CsvPreview segments={SEGMENTS} />);

    rerender(<CsvPreview segments={[{ ...SEGMENTS[0], playType: 'Run' }]} />);

    expect(screen.getByText('Run')).toBeInTheDocument();
    expect(screen.queryByText('Pass')).not.toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });

  it('shows an empty state and no table when there are no segments', () => {
    render(<CsvPreview segments={[]} />);

    expect(screen.getByText('csvPreviewEmpty')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders a scrollable container', () => {
    render(<CsvPreview segments={SEGMENTS} />);

    expect(screen.getByRole('table').parentElement).toHaveStyle({ overflow: 'auto' });
  });
});
