import { lazy, Suspense, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';

import { Alert, Box, IconButton, Typography } from '@mui/material';
import { SidePanel } from 'details/SidePanel';
import { ErrorBoundary } from 'lib/react/ErrorBoundary';
import { MobileTabContentWatcher } from 'lib/map/layouts/tab-has-content';
import {
  pixelDrillerDataHeaders,
  pixelDrillerDataState,
  pixelDrillerExportRecords,
  pixelSelectionState,
} from 'lib/state/pixel-driller';
import Close from '@mui/icons-material/Close';
import { CopyableLink } from 'lib/nav/CopyableLink';
import Download from '@mui/icons-material/Download';
import { DownloadDataProvider, useDownloadDataContext } from './download/download-context';
import { buildReadmeFile } from './download/download-generators';
import { createSpatialPoint } from './download/metadata-common';
import type { RdlsMetadataPackage } from './download/metadata-types';
import { buildZipFile, downloadBlob } from './download/download-utils';
import type { DownloadFile } from './download/types';

const domainModules = {
  fluvial: () => import('./domains/fluvial'),
  surface: () => import('./domains/surface'),
  coastal: () => import('./domains/coastal'),
  cyclone: () => import('./domains/cyclone'),
};

const domainComponents = {
  fluvial: lazy(domainModules.fluvial),
  surface: lazy(domainModules.surface),
  coastal: lazy(domainModules.coastal),
  cyclone: lazy(domainModules.cyclone),
};
const datasetFetchers = {
  fluvial: await domainModules.fluvial().then((mod) => mod.getMetadata),
  surface: await domainModules.surface().then((mod) => mod.getMetadata),
  coastal: await domainModules.coastal().then((mod) => mod.getMetadata),
  cyclone: await domainModules.cyclone().then((mod) => mod.getMetadata),
};

/**
 * Display detailed information about a selected pixel (lat/lon point.)
 */
const PixelDataInner = () => {
  const selectedData = useAtomValue(pixelDrillerDataState);
  const exportRecords = useAtomValue(pixelDrillerExportRecords);
  const headers = useAtomValue(pixelDrillerDataHeaders);
  const [pixelSelection, setPixelSelection] = useAtom(pixelSelectionState);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAllExportConfigs } = useDownloadDataContext();

  function clearSelectedLocation() {
    setPixelSelection(null);
  }

  if (!selectedData) {
    return null;
  }
  if (!headers.length) {
    return null;
  }

  const lat = pixelSelection?.lat;
  const lon = pixelSelection?.lon;

  const makeDownloadZipFile = async () => {
    if (!selectedData || lat == null || lon == null) return;

    setDownloading(true);
    try {
      const exportConfigs = getAllExportConfigs();

      // Call all registered export functions with the full dataset
      const exportPromises: Promise<DownloadFile | DownloadFile[]>[] = Array.from(
        exportConfigs.entries(),
      ).map(async ([key, { exportFunction }]) => {
        try {
          return await exportFunction(exportRecords);
        } catch (err) {
          console.error(`Error exporting data for ${key}:`, err);
          return [] as DownloadFile[];
        }
      });

      const exportFileGroups = await Promise.all(exportPromises);
      let exportFiles = exportFileGroups.flat();

      // Build RDLS-style metadata.json from domain metadata definitions.
      const spatial = createSpatialPoint(lat, lon);
      const datasets = await Promise.all(
        Object.values(datasetFetchers)
          .map((fetcher) => fetcher({ spatial }))
          .filter(Boolean) as RdlsMetadataPackage['datasets'],
      );
      const metadata: RdlsMetadataPackage = {
        $schema: './metadata.schema.json',
        datasets,
      };

      const metadataFile: DownloadFile = {
        filename: 'metadata.json',
        content: JSON.stringify(metadata, null, 2),
        mimeType: 'application/json',
      };

      const readmeFile = buildReadmeFile(exportConfigs);

      // Always include README and site metadata in the ZIP
      exportFiles = [readmeFile, metadataFile, ...exportFiles];

      // Build ZIP file
      const zipBlob = await buildZipFile(exportFiles);

      // Generate filename with coordinates
      const filename = `site-details-${lat.toFixed(6)}-${lon.toFixed(6)}.zip`;
      downloadBlob(zipBlob, filename);
    } catch (err) {
      console.error('Error creating download:', err);
      setError(err instanceof Error ? err.message : 'Failed to create download');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <SidePanel position="relative">
      <MobileTabContentWatcher tabId="details" />
      <ErrorBoundary message="There was a problem displaying these details.">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Site Details
          </Typography>
          <Box>
            <IconButton
              title="Download site data package"
              onClick={makeDownloadZipFile}
              disabled={downloading}
            >
              <Download />
            </IconButton>
            <IconButton onClick={clearSelectedLocation} title={'Close'}>
              <Close />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Coordinates:{' '}
          <CopyableLink
            href={window.location.pathname + window.location.search} // current URL path + query
            label={`${lat?.toFixed(6)}, ${lon?.toFixed(6)}`}
            copyTooltip="Copy site URL"
          />
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {Object.entries(domainComponents).map(([pixel_layer, PixelDataGrid]) => (
          <Box key={pixel_layer} mt={2}>
            <Suspense fallback="Loading…">
              <PixelDataGrid pixel_layer={pixel_layer} />
            </Suspense>
          </Box>
        ))}
      </ErrorBoundary>
    </SidePanel>
  );
};

export const PixelData = () => {
  return (
    <DownloadDataProvider>
      <PixelDataInner />
    </DownloadDataProvider>
  );
};
