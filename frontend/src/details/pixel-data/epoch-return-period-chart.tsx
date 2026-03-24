import { KeyboardEvent as ReactKeyboardEvent, useMemo } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { unique } from 'lib/helpers';
import { useSelect } from 'lib/hooks/use-select';
import { ReturnPeriodDamageChart } from 'details/features/damages/ReturnPeriodDamageChart';

type PixelReturnPeriodRow = {
  epoch: number;
  rcp: string;
  [key: string]: string | number | undefined;
};

type EpochReturnPeriodChartProps = {
  rows: PixelReturnPeriodRow[];
  fieldTitle: string;
  width?: number;
  height?: number;
};

export const EpochReturnPeriodChart = ({
  rows,
  fieldTitle,
  width = 280,
  height = 170,
}: EpochReturnPeriodChartProps) => {
  const epochs = useMemo(() => unique(rows.map((row) => row.epoch)).sort((a, b) => a - b), [rows]);
  const [selectedEpoch, setSelectedEpoch] = useSelect(epochs);

  const handleEpochKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!epochs.length || selectedEpoch == null) {
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setSelectedEpoch(epochs[0]);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setSelectedEpoch(epochs[epochs.length - 1]);
      return;
    }

    let offset = 0;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      offset = 1;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      offset = -1;
    } else {
      return;
    }

    event.preventDefault();
    const currentIndex = epochs.indexOf(selectedEpoch);
    const nextIndex = (currentIndex + offset + epochs.length) % epochs.length;
    setSelectedEpoch(epochs[nextIndex]);
  };

  const chartData = useMemo(() => {
    const table = rows
      .filter((row) => row.epoch === selectedEpoch)
      .flatMap((row) => {
        const rcp = row.rcp === '-' ? 'baseline' : row.rcp;
        return Object.entries(row)
          .filter(([key]) => key.startsWith('rp-'))
          .map(([key, value]) => {
            const rp = Number(key.replace('rp-', ''));
            const numericValue = typeof value === 'string' ? Number(value) : value;
            if (!Number.isFinite(rp) || !Number.isFinite(numericValue)) {
              return null;
            }
            return {
              rcp,
              rp,
              probability: 1 / rp,
              value: numericValue,
            };
          })
          .filter(
            (d): d is { rcp: string; rp: number; probability: number; value: number } => d !== null,
          );
      });
    return { table };
  }, [rows, selectedEpoch]);

  if (!rows.length) {
    return null;
  }

  return (
    <>
      {epochs.length ? (
        <ToggleButtonGroup
          exclusive
          size="small"
          value={selectedEpoch ?? null}
          onKeyDown={handleEpochKeyDown}
          onChange={(_, epoch) => {
            if (epoch !== null) {
              setSelectedEpoch(epoch);
            }
          }}
          sx={{ my: 2, display: 'flex', flexWrap: 'wrap' }}
        >
          {epochs.map((epoch) => (
            <ToggleButton key={epoch} value={epoch} disabled={epochs.length === 1}>
              {epoch}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      ) : null}
      <ReturnPeriodDamageChart
        data={chartData}
        field_key="value"
        field_title={fieldTitle}
        actions={false}
        width={width}
        height={height}
        renderer="svg"
      />
    </>
  );
};
