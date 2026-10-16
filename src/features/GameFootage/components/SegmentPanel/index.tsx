import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { type PlayDown, type PlaySide, type Segment } from '../../../../redux/SegmentSlice';
import CsvPreview from '../CsvPreview';
import PlayClassifier from '../PlayClassifier';
import SegmentTable from '../SegmentTable';

interface SegmentPanelBaseProps {
  videoType: 'file' | 'youtube' | null;
  segments: Segment[];
  readOnly?: boolean;
  activeSegmentId: string | null;
  isExportingZip: boolean;
  exportZipProgress: number;
  exportError?: string | null;
  onDelete?: (id: string) => void;
  onSegmentClick?: (id: string) => void;
  onExportCsv?: () => void;
  onExportJson?: () => void;
  onExportZip?: () => void;
}

interface SegmentPanelClassifierProps extends SegmentPanelBaseProps {
  classifierMode: true;
  activeSegment: Segment | null;
  onSetSide: (id: string, side: PlaySide | undefined) => void;
  onSetDown: (id: string, down: PlayDown | undefined) => void;
  onSetPlayType: (id: string, playType: string | undefined) => void;
  onSetResult: (id: string, result: string | undefined) => void;
  onSetPlayer: (id: string, player: string | undefined) => void;
  onSetTags: (id: string, tags: string[]) => void;
}

interface SegmentPanelDefaultProps extends SegmentPanelBaseProps {
  classifierMode?: false;
  activeSegment?: Segment | null;
  onSetSide?: (id: string, side: PlaySide | undefined) => void;
  onSetDown?: (id: string, down: PlayDown | undefined) => void;
  onSetPlayType?: (id: string, playType: string | undefined) => void;
  onSetResult?: (id: string, result: string | undefined) => void;
  onSetPlayer?: (id: string, player: string | undefined) => void;
  onSetTags?: (id: string, tags: string[]) => void;
}

export type SegmentPanelProps = SegmentPanelClassifierProps | SegmentPanelDefaultProps;

export default function SegmentPanel(props: SegmentPanelProps) {
  const {
    videoType,
    segments,
    readOnly,
    classifierMode,
    activeSegment,
    activeSegmentId,
    isExportingZip,
    exportZipProgress,
    exportError,
    onDelete,
    onSegmentClick,
    onExportCsv,
    onExportJson,
    onExportZip,
  } = props;
  const { t } = useTranslation('gameFootage');

  const activeSegmentNumber = useMemo(() => {
    if (!activeSegment) return null;
    const index = segments.findIndex((s) => s.id === activeSegment.id);
    return index >= 0 ? index + 1 : null;
  }, [activeSegment, segments]);

  return (
    <Card>
      <CardContent>
        <Stack sx={{ gap: '1rem' }}>
          <Stack
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <Typography variant="h5" component="h2">
              {t('segments') ?? <Skeleton width="6rem" />}
            </Typography>

            <Stack sx={{ flexDirection: 'row', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                size="small"
                disabled={segments.length === 0}
                onClick={onExportCsv}
              >
                {t('exportCsv') ?? <Skeleton width="6rem" />}
              </Button>

              <Button
                variant="outlined"
                size="small"
                disabled={segments.length === 0}
                onClick={onExportJson}
              >
                {t('exportJson') ?? <Skeleton width="7rem" />}
              </Button>

              {videoType === 'file' && (
                <Button
                  variant="contained"
                  size="small"
                  disabled={segments.length === 0 || isExportingZip}
                  onClick={onExportZip}
                  startIcon={isExportingZip
                    ? (
                        <CircularProgress
                          size="1rem"
                          aria-hidden="true"
                          sx={{ color: (theme) => theme.palette.primary.contrastText }}
                        />
                      )
                    : undefined}
                >
                  {isExportingZip
                    ? (
                        t('exportZipProgress', { progress: Math.round(exportZipProgress * 100) })
                        ?? <Skeleton width="9rem" />
                      )
                    : (t('exportZip') ?? <Skeleton width="7rem" />)}
                </Button>
              )}
            </Stack>
          </Stack>

          <Divider />

          {exportError && (
            <Alert severity="error">
              <Stack sx={{ gap: '0.25rem' }}>
                <Typography variant="body2" component="p">{t('exportZipError')}</Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                    <Typography variant="caption">
                      {t('exportZipErrorDetails')}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ padding: 0, paddingTop: '0.25rem' }}>
                    <Typography
                      variant="caption"
                      component="pre"
                      sx={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
                    >
                      {exportError}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Alert>
          )}

          {videoType === 'youtube' && (
            <Typography variant="caption" color="text.secondary">
              {t('exportZipUnavailableYoutube') ?? <Skeleton sx={{ maxWidth: '28rem' }} />}
            </Typography>
          )}

          {classifierMode && (
            <>
              {activeSegment && activeSegmentNumber !== null
                ? (
                    <PlayClassifier
                      key={activeSegment.id}
                      segment={activeSegment}
                      segmentNumber={activeSegmentNumber}
                      onSetSide={props.onSetSide}
                      onSetDown={props.onSetDown}
                      onSetPlayType={props.onSetPlayType}
                      onSetResult={props.onSetResult}
                      onSetPlayer={props.onSetPlayer}
                      onSetTags={props.onSetTags}
                    />
                  )
                : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {t('classifier.noSegmentSelected') ?? (
                          <Skeleton sx={{ maxWidth: '20rem' }} />
                        )}
                      </Typography>

                      <Divider />
                    </>
                  )}
            </>
          )}

          <SegmentTable
            segments={segments}
            hideTitle
            readOnly={readOnly}
            activeSegmentId={activeSegmentId}
            onDelete={onDelete}
            onSegmentClick={onSegmentClick}
          />

          <CsvPreview segments={segments} />
        </Stack>
      </CardContent>
    </Card>
  );
}
