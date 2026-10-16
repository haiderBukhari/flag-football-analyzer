import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { type Segment } from '../../../../redux/SegmentSlice';
import { CSV_COLUMNS, segmentsToCsvRows } from '../../../../utils/exportSegments';

export interface CsvPreviewProps {
  segments: Segment[];
}

export default function CsvPreview({ segments }: CsvPreviewProps) {
  const { t } = useTranslation('gameFootage');
  const rows = useMemo(() => segmentsToCsvRows(segments), [segments]);

  return (
    <Accordion defaultExpanded disableGutters variant="outlined">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="csv-preview-content"
        id="csv-preview-header"
      >
        <Typography variant="h6" component="h3">
          {t('csvPreviewTitle') ?? <Skeleton width="8rem" />}
        </Typography>
      </AccordionSummary>

      <AccordionDetails id="csv-preview-content" sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Typography variant="body2" color="text.secondary">
          {t('csvPreviewDescription') ?? <Skeleton sx={{ maxWidth: '20rem' }} />}
        </Typography>

        {rows.length === 0
          ? (
              <Typography variant="body2" color="text.secondary">
                {t('csvPreviewEmpty') ?? <Skeleton sx={{ maxWidth: '20rem' }} />}
              </Typography>
            )
          : (
              <TableContainer
                // Focusable so keyboard users can scroll the region
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                role="region"
                aria-label={t('csvPreviewTitle')}
                sx={{ maxHeight: '18rem', maxWidth: '100%', overflow: 'auto' }}
              >
                <Table size="small" stickyHeader aria-label={t('csvPreviewTitle')}>
                  <TableHead>
                    <TableRow>
                      {CSV_COLUMNS.map((column) => (
                        <TableCell key={column} sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row[1]}>
                        {row.map((value, i) => (
                          <TableCell key={CSV_COLUMNS[i]} sx={{ fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
      </AccordionDetails>
    </Accordion>
  );
}
