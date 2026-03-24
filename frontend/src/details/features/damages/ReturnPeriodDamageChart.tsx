import { useMemo, useRef, useEffect } from 'react';
import { useVegaEmbed } from 'react-vega';
import { VisualizationSpec } from 'vega-embed';
import { Box } from '@mui/material';

import { unique } from 'lib/helpers';

const makeSpec = (
  rpValues: number[],
  field_key: string,
  field_title: string,
  width: number,
  height: number,
) => ({
  $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
  width,
  height,
  data: {
    name: 'table',
  },
  mark: {
    type: 'line',
    point: {
      filled: true,
    },
    tooltip: true,
  },
  encoding: {
    x: {
      field: 'probability',
      type: 'quantitative',
      title: 'Probability',
      axis: {
        gridDash: [2, 2],
        domainColor: '#ccc',
        tickColor: '#ccc',
      },
    },
    y: {
      field: field_key,
      type: 'quantitative',
      title: field_title,
      axis: {
        gridDash: [2, 2],
        domainColor: '#ccc',
        tickColor: '#ccc',
      },
    },

    color: {
      field: 'rcp',
      type: 'ordinal',
      scale: {
        domain: ['baseline', '2.6', '4.5', '8.5'],
        // Could do custom colours
        // range: ["#e7ba52", "#c7c7c7", "#aec7e8", "#1f77b4"]
      },
      title: 'RCP',
      legend: {
        orient: 'bottom',
        direction: 'horizontal',
      },
    },
    // the tooltip encoding needs to replicate the field definitions in order to customise their ordering
    tooltip: [
      { field: field_key, type: 'quantitative', format: ',.3r', title: field_title },
      { field: 'rcp', title: 'RCP' },
      { field: 'rp', title: 'Return Period' },
    ],
  },
});

export const ReturnPeriodDamageChart = ({
  data,
  field_key,
  field_title,
  width,
  height,
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const spec = useMemo(
    () =>
      makeSpec(
        unique<number>(data.table.map((d) => d.rp))
          .sort()
          .reverse(),
        field_key,
        field_title,
        width,
        height,
      ),
    [data, field_key, field_title, width, height],
  ) as VisualizationSpec;
  const embed = useVegaEmbed({
    ref,
    spec,
    options: {
      mode: 'vega-lite',
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 50,
      },
      ...props,
    },
  });

  useEffect(() => {
    embed?.view.data('table', data.table).runAsync();
  }, [embed, data]);

  return <Box ref={ref} />;
};
