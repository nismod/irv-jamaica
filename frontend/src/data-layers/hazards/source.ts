export const HAZARD_SOURCE = {
  getDataUrl(
    { hazardType, hazardParams: { returnPeriod, rcp, epoch, confidence, speed = 0 } },
    { scheme, range },
  ) {
    const sanitisedRcp = rcp.replace('.', 'x');
    const sanitisedType = hazardType === 'storm' ? `storm${speed}` : hazardType;

    return `/raster/singleband/${sanitisedType}/${returnPeriod}/${sanitisedRcp}/${epoch}/${confidence}/{z}/{x}/{y}.png?colormap=${scheme}&stretch_range=[${range[0]},${range[1]}]`;
  },
};
