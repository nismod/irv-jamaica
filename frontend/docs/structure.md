# Code structure

Author: Jim O'Donnell

Date: 9 August 2024

- `src/`
  - `app/` - app config and state.
    - `config/` - contains the configuration and code related to the various
      datasets and visualisation layers, as well as other pieces of configuration.
      - `basemaps.ts` - configuration of basemap styles.
      - `interaction-groups.ts` - configuration of all the interaction groups
        available in the app.
      - `map-view.ts` - configuration of the initial map view coordinates, zoom
        etc.
      - `sections.ts` - style config for the sidebar sections.
      - `sources.ts` - functions to build URLs to access datasets in the
        vector/raster backends.
      - `view-layers.ts` - a list of the view layer IDs used by the map.
      - `views.ts` - default sidebar state (visible/hidden, expanded/collapsed etc.) for the individual map views.
    - `map/` - UI, layout and behaviour of the main map view of the app. Sets up the base map and passes app data layer state to the data map.
    - `pages/` - contents and layouts of the main pages of the app.
    - `sidebar/` - the main layer selection sidebar.
      - `SidebarContent.tsx` - defining the overall contents of the sidebar.
    - `state/` - Recoil state for the app.
      - `damage-mapping/` - damage mapping from hazards to network assets.
      - `layers/` - state which creates the view layer instances based on app
        state and data selection state.
        - `ui/` - special layers for UI (e.g. feature bounding box layer.)
        - `interaction-groups.ts` - state containing all active interaction groups.
        - `view-layers.ts` - state combining all active view layers.
        - `view-layer-params.ts` - state setting up the dynamic view layer
          parameters.
      - `data-params.ts` - view layer data parameters. Updated from the sidebar and used to construct map tile URLs.
      - `sections.ts` - section state for individual sidebar sections.
      - `view.ts` - view state for individual map views.
    - `Nav.tsx` - main navigation component.
    - `theme.ts` - MUI theme configuration.
    - `use-is-mobile.ts` - util hook.
  - `data-layers/` - config and state for individual data layers. There should be a folder here for each entry in `config/view-layers.ts`
    - `assets/` - common functionality for "vector assets" - vector feature layers that can have damages data visualised on them.
    - `[layer-name]` - config for layer `layer-name`. should include the following subfolders:
      - `sidebar/` - sidebar React components to control this layer.
      - `state/` - Recoil state for this layer, including:
        - `data-selection.ts` - Data selection state.
        - `layer.ts` - creates a view layer to display in the map. The app will error if this file doesn't exist.
  - `details/` - UI and logic for displaying details when a vector feature is clicked in the map.
  - `lib/` - self-contained library code which should be unrelated to the specific
    datasets/content of the app. **NOTE** there is an ESLint rule enforcing that
    files inside the `lib` folder cannot import code from any other folder in
    the project, to enforce the separation between generic and content-specific
    code.
  - `App.ts` - main React app component.
  - `index.css` - global styles (avoid, set styles in components instead.)
  - `index.tsx` - Vite app entry point.
  - `vite-env.d.ts` - Vite types inclusion.
