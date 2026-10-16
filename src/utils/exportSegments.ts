import { type Segment } from '../redux/SegmentSlice';

export const CSV_COLUMNS = ['clipName', 'id', 'start', 'end', 'duration', 'playType', 'tags'] as const;

/** Returns the canonical zero-padded segment label for a 0-based index, e.g. `segment_001`. */
export function formatSegmentId(index: number): string {
  return `segment_${String(index + 1).padStart(3, '0')}`;
}

/**
 * Escapes a single CSV field per RFC 4180: wraps in double-quotes if the value
 * contains a comma, double-quote, or newline, and doubles any internal quotes.
 */
function csvField(value: string): string {
  if (/[,"\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

/**
 * Single source of truth for the CSV body: raw (unescaped) cell values, one
 * array per segment, ordered as {@link CSV_COLUMNS}. Used by both the download
 * and the on-screen preview so they cannot drift apart.
 */
export function segmentsToCsvRows(segments: Segment[]): string[][] {
  return segments.map((s, i) => [
    formatSegmentId(i),
    s.id,
    String(s.start),
    String(s.end),
    String(s.duration),
    s.playType ?? '',
    (s.tags ?? []).join('|'),
  ]);
}

export function segmentsToCsv(segments: Segment[]): string {
  const rows = segmentsToCsvRows(segments).map((row) => row.map(csvField).join(','));

  return [CSV_COLUMNS.join(','), ...rows].join('\n');
}

export function segmentsToJson(segments: Segment[]): string {
  const labeled = segments.map((s, i) => ({
    ...s,
    clipName: formatSegmentId(i),
  }));

  return JSON.stringify({ segments: labeled }, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
}
