export const chartStyles = {
  color: {
    field: 'rcp',
    type: 'ordinal',
    scale: {
      domain: ['baseline', '2.6', '4.5', '8.5'],
      range: ['#8b8b8b', '#003466', '#709fcc', '#980002'],
    },
    title: 'RCP',
    legend: {
      orient: 'bottom',
      direction: 'horizontal',
    },
  },
  shape: {
    field: 'rcp',
    type: 'ordinal',
    legend: null,
    scale: {
      domain: ['baseline', '2.6', '4.5', '8.5'],
      range: ['circle', 'square', 'triangle-up', 'diamond'],
    },
  },
};
