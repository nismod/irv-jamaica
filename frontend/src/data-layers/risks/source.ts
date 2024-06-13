export const RISK_SOURCE = {
  getDataUrl({ riskType }, { scheme, range }) {
    return `/raster/singleband/${riskType}/100/baseline/2010/None/{z}/{x}/{y}.png?colormap=${scheme}&stretch_range=[${range[0]},${range[1]}]`;
  },
};
