import { TreeNode } from 'lib/controls/checkbox-tree/tree-node';

interface LanduseTypeData {
  id: string;
  label: string;
  url?: string;
}

export const LANDUSE_HIERARCHY: TreeNode<LanduseTypeData>[] = [
  {
    id: 'agriculture',
    label: 'Agriculture',
    children: [
      { id: 'Fields: Bare Land', label: 'Fields: Bare Land', url: '01' },
      {
        id: 'Fields: Herbaceous crops, fallow, cultivated vegetables',
        label: 'Fields: Herbaceous crops, fallow, cultivated vegetables',
        url: '02',
      },
      {
        id: 'Fields: Pasture,Human disturbed, grassland',
        label: 'Fields: Pasture, human-disturbed, grassland',
        url: '03',
      },
    ],
  },
  { id: 'Bare Rock', label: 'Bare Rock', url: '04' },
  {
    id: 'bamboo',
    label: 'Bamboo and Mixed',
    children: [
      { id: 'Bamboo', label: 'Bamboo', url: '05' },
      { id: 'Bamboo and Fields', label: 'Bamboo and Fields', url: '06' },
      { id: 'Bamboo and Secondary Forest', label: 'Bamboo and Secondary Forest', url: '07' },
      { id: 'Fields  and Bamboo', label: 'Fields and Bamboo', url: '08' },
    ],
  },
  { id: 'Buildings and other infrastructures', label: 'Built-up areas', url: '09' },
  {
    id: 'forest',
    label: 'Forest',
    children: [
      {
        id: 'Closed broadleaved forest (Primary Forest)',
        label: 'Closed broadleaved forest (Primary Forest)',
        url: '0a',
      },
      {
        id: 'Disturbed broadleaved forest (Secondary Forest)',
        label: 'Disturbed broadleaved forest (Secondary Forest)',
        url: '0b',
      },
      { id: 'Secondary Forest', label: 'Secondary Forest', url: '0c' },
      { id: 'Swamp Forest', label: 'Swamp Forest', url: '0d' },
      { id: 'Mangrove Forest', label: 'Mangrove Forest', url: '0e' },
    ],
  },
  {
    id: 'mining',
    label: 'Mining',
    children: [
      { id: 'Bauxite Extraction', label: 'Bauxite Extraction', url: '0f' },
      { id: 'Quarry', label: 'Quarry', url: '10' },
    ],
  },
  {
    id: 'mixed',
    label: 'Mixed Use',
    children: [
      { id: 'Fields and Secondary Forest', label: 'Fields and Secondary Forest', url: '11' },
      {
        id: 'Fields or Secondary Forest/Pine Plantation',
        label: 'Fields or Secondary Forest/Pine Plantation',
        url: '12',
      },
    ],
  },
  {
    id: 'open-dry-forest',
    label: 'Open dry forest',
    children: [
      { id: 'Open dry forest - Short', label: 'Open dry forest - Short', url: '13' },
      {
        id: 'Open dry forest - Tall (Woodland/Savanna)',
        label: 'Open dry forest - Tall (Woodland/Savanna)',
        url: '14',
      },
    ],
  },
  {
    id: 'plantation',
    label: 'Plantation',
    children: [
      { id: 'Hardwood Plantation: Euculytus', label: 'Hardwood Plantation: Euculytus', url: '15' },
      { id: 'Hardwood Plantation: Mahoe', label: 'Hardwood Plantation: Mahoe', url: '16' },
      { id: 'Hardwood Plantation: Mahogany', label: 'Hardwood Plantation: Mahogany', url: '17' },
      { id: 'Hardwood Plantation: Mixed', label: 'Hardwood Plantation: Mixed', url: '18' },
      {
        id: 'Plantation: Tree crops, shrub crops, sugar cane, banana',
        label: 'Plantation: Tree crops, shrub crops, sugar cane, banana',
        url: '19',
      },
    ],
  },
  { id: 'Water Body', label: 'Water Body', url: '1a' },
  {
    id: 'wetland',
    label: 'Wetland',
    children: [{ id: 'Herbaceous Wetland', label: 'Herbaceous Wetland', url: '1b' }],
  },
];
