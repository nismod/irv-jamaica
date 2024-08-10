# How To & Guide

Author: Jim O'Donnell

Last modified: 09 Aug 2024

Based on: `irv-frontend` how-to by Maciej Ziarkowski (08 Jan 2023.)

## View Layers

A view layer is the central concept in the framework. A view layer represents
the visualisation of a dataset in the application, and bundles functionality for
both rendering the Deck.GL map layers, as well as rendering React components for
UI elements related to the layer, such as legend, hover tooltip, selected
feature details.

### Add a new view layer

1. Add a new layer name to `config/viewLayers.ts` (eg. `'hazards'`.) This name will be used to name folders and files in subsequent steps.
2. Create a folder for the new dataset inside `data-layers/`, named after the new layer. For example,
   `data-layers/hazards/`.
3. Define a helper function that will create a ViewLayer object, given some
   arguments (or no arguments.) eg. `data-layers/hazards/hazards-view-layer.ts`.
4. Define any corresponding layer selection state in a `state/` subfolder (eg. `data-layers/hazards/state/data-selection.ts`) and `state/data-params.ts`.
5. Define the view layer state in a file named `state/layer.ts` eg. `data-layers/hazards/state/layer.ts`. This file must export a named `LayerState` export derived from the layer name eg. `export const hazardsLayerState`.
6. Add a sidebar subfolder (eg. `data-layers/hazards/sidebar/`) with React components that control the layer selection state. Import the new section into `sidebar/SidebarContent.tsx`, and add it to the views that use it. Define a default view state (eg. visible/hidden, expanded/collapsed) in `config/views.ts`.

NOTE: the framework does not define the structure for the code surrounding a
view layer definition. The main consideration is to avoid circular dependencies
between files, hence the frequent division into e.g. a `metadata.ts` file, a
view layer factory file, etc.

## Interaction Groups

Interaction groups are the main mechanism for handling map interactions in the
framework. An interaction group defines:

- the type of map interaction. Currently two types: vector (nearest feature,
  with tolerance defined by `pickingRadius`) or raster (pixel picking)
- whether multiple features or just one feature should be picked from the
  interaction group
- some other deck.gl-related interaction parameters such as picking radius

### Add a new interaction group

1. Define a new interaction group in `config/interaction-groups.ts`
2. If appropriate, add `renderLegend` and `renderTooltip` methods to each view layer that has tooltips.
3. For vector layers, update `details/DetailsSidebar` to show popup details when a vector asset is clicked on the map.

## Data Map

The Data Map is the main component responsible for rendering an interactive data
visualisation map. It accepts a list of view layers, and a list of interaction
groups, and sets up the rendering and interaction settings based on that.

## App Structure

The following parts of the application structure are fairly independent and
their internal organisation should be possible to rework without significantly
modifying the other parts of the app:

- default map view parameters in `config/map-view.ts`.
- view layer config and Recoil state in folders under `data-layers/`.
- data/layer selection sidebar UI and its Recoil state (in `data-layers/[layer-name/sidebar/` and
  `state/data-params.ts`.)
- app components for the map view:
  - `pages/map/MapPage.tsx`
  - `map/MapView.tsx`
  - `map/BaseMap.tsx`
  - `map/DataMap.tsx`

with the following crucial dependencies / interactions:

- Sidebar components control data selection state for individual view layers.
- View layer state uses data selection state and view layer config. Changes to view layer state are rendered on the map data layers.
- `pages/map/MapPage` and its desktop/mobile layout components, assemble
  together all elements of the interactive map layout - sidebar, legend, feature
  selection sidebar, map HUD, the map itself
- `map/MapView` combines `map/BaseMap`, `map/DataMap`, tooltip
  etc (these are all components that depend on the view state of the map.) `BaseMap` and `DataMap` each use Recoil state to render the base map and data layers respectively.

NOTE that with the current setup, the `ViewLayer` objects are created inside
corresponding Recoil state in `data-layers/[layer-name]/state/layer.ts`, and are therefore
recreated only when the dependencies of the state change. So the view layers are
not recreated on every frame, which helps with performance especially if the
view layer helper function contains some more time-consuming logic. The `fn`
method of each view layer (which produces a list of Deck.GL layers for the view
layer), on the other hand, will be called on every update to the map, for
example whenever the map view state changes (e.g. upon zooming). Therefore, any
time consuming calculations that don't depend on dynamically changing values
such as map view state or current selection, should be done once when the view
layer object is created - and not inside the `fn` method.
