/*
The Vite SVGR plugin exports SVG components and SVG URLs, but you have to know the magic
URL query params. See https://stackoverflow.com/a/70314031
*/
import CircleShape from './shapes/circle.svg?react';
import CircleShapeSrc from './shapes/circle.svg?url';
import SquareShape from './shapes/square.svg?react';
import SquareShapeSrc from './shapes/square.svg?url';
import PolygonShape from './shapes/polygon.svg?react';
import PolygonShapeSrc from './shapes/polygon.svg?url';
import LineShape from './shapes/line.svg?react';
import LineShapeSrc from './shapes/line.svg?url';
import InvTriangleShape from './shapes/inv-triangle.svg?react';
import InvTriangleShapeSrc from './shapes/inv-triangle.svg?url';
import DiamondShape from './shapes/diamond.svg?react';
import DiamondShapeSrc from './shapes/diamond.svg?url';

export const MAP_SHAPE_TYPES = [
  'line',
  'circle',
  'square',
  'polygon',
  'inv-triangle',
  'diamond',
] as const;
export type MapShapeType = (typeof MAP_SHAPE_TYPES)[number];

type SVGComponent = typeof LineShape;

export const shapeComponents: Record<MapShapeType, SVGComponent> = {
  line: LineShape,
  circle: CircleShape,
  square: SquareShape,
  polygon: PolygonShape,
  'inv-triangle': InvTriangleShape,
  diamond: DiamondShape,
};

export const shapeUrls: Record<MapShapeType, string> = {
  line: LineShapeSrc,
  circle: CircleShapeSrc,
  square: SquareShapeSrc,
  polygon: PolygonShapeSrc,
  'inv-triangle': InvTriangleShapeSrc,
  diamond: DiamondShapeSrc,
};
