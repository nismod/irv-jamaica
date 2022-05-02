export interface ViewSectionConfig {
  expanded: boolean;
  visible: boolean;
  styles?: string[];
  defaultStyle?: string;
}

export const VIEW_SECTIONS: Record<string, Record<string, ViewSectionConfig>> = {
  exposure: {
    assets: {
      expanded: true,
      visible: true,
      styles: ['type'],
      defaultStyle: 'type',
    },
    hazards: {
      expanded: true,
      visible: true,
    },
    buildings: {
      expanded: false,
      visible: false,

      styles: ['type'],
      defaultStyle: 'type',
    },
    regions: {
      expanded: false,
      visible: true,

      styles: ['boundaries', 'population'],
      defaultStyle: 'boundaries',
    },
  },
  risk: {
    assets: {
      expanded: true,
      visible: true,

      styles: ['type', 'damages'],
      defaultStyle: 'damages',
    },
    hazards: {
      expanded: false,
      visible: true,
    },
    buildings: {
      expanded: false,
      visible: false,

      styles: ['type'],
      defaultStyle: 'type',
    },
    regions: {
      expanded: false,
      visible: true,

      styles: ['boundaries', 'population'],
      defaultStyle: 'boundaries',
    },
  },
  adaptation: {
    assets: {
      expanded: true,
      visible: true,

      styles: ['type', 'damages', 'adaptation'],
      defaultStyle: 'adaptation',
    },
    drought: {
      expanded: true,
      visible: false,
      styles: ['adaptation'],
      defaultStyle: 'adaptation',
    },
    hazards: {
      expanded: false,
      visible: true,
    },
    buildings: {
      expanded: false,
      visible: false,

      styles: ['type'],
      defaultStyle: 'type',
    },
    regions: {
      expanded: false,
      visible: true,

      styles: ['boundaries', 'population'],
      defaultStyle: 'boundaries',
    },
  },
  'nature-based-solutions': {
    terrestrial: {
      expanded: true,
      visible: true,
      styles: ['landuse', 'slope', 'elevation'],
      defaultStyle: 'landuse',
    },
    marine: {
      expanded: true,
      visible: false,
      styles: ['habitat'],
      defaultStyle: 'habitat',
    },
    assets: {
      expanded: false,
      visible: false,
      styles: ['type', 'damages'],
      defaultStyle: 'type',
    },
    hazards: {
      expanded: false,
      visible: false,
    },
  },
};
