import { HazardParams } from './domains';

export const HAZARD_SOURCE = {
  getDataUrl(
    {
      hazardType,
      hazardParams: {
        returnPeriod = 100,
        rcp = 'baseline',
        epoch = 2010,
        confidence = 'None',
        speed = 0,
      } = {},
    }: { hazardType: string; hazardParams?: Partial<HazardParams> },
    { scheme, range }: { scheme: string; range: [number, number] },
  ) {
    const sanitisedRcp = String(rcp).replace('.', 'x');
    const sanitisedType = hazardType === 'storm' ? `storm${speed}` : hazardType;

    return `/raster/singleband/${sanitisedType}/${returnPeriod}/${sanitisedRcp}/${epoch}/${confidence}/{z}/{x}/{y}.png?colormap=${scheme}&stretch_range=[${range[0]},${range[1]}]`;
  },
};
