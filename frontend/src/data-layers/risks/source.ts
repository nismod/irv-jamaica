export const RISK_SOURCE = {
  getDataUrl(
    { riskType, riskParams: { hazard, returnPeriod, rcp, epoch, confidence } },
    { scheme, range },
  ) {
    const sanitisedRcp = rcp?.replace('.', 'x');
    console.log({ riskType, hazard, returnPeriod, sanitisedRcp, epoch, confidence });

    //return `/raster/singleband/fluvial/100/baseline/2010/None/{z}/{x}/{y}.png?colormap=${scheme}&stretch_range=[${range[0]},${range[1]}]`;
    return `/raster/singleband/${riskType}/100/baseline/2010/None/{z}/{x}/{y}.png?colormap=${scheme}&stretch_range=[${range[0]},${range[1]}]`;
  },
};
