import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { FieldSpec } from 'lib/data-map/view-layers';
import { FC, ReactNode, Suspense, useCallback, useEffect, useState } from 'react';
import { LayerSpec, ListFeature, useSortedFeatures } from './use-sorted-features';

type AssetTableBodyProps = {
  layerSpec: LayerSpec;
  fieldSpec: FieldSpec;
  page: number;
  pageSize: number;
  renderRow: (feature: ListFeature, localIndex: number, globalIndex: number) => ReactNode;
};
const AssetTableBody: FC<AssetTableBodyProps> = ({
  layerSpec,
  fieldSpec,
  page,
  pageSize,
  renderRow,
}) => {
  const { features, error } = useSortedFeatures(layerSpec, fieldSpec, page, pageSize);
  const currentPageFirstItemIndex = (page - 1) * pageSize;
  return (
    <TableBody>
      {error && (
        <TableRow>
          <TableCell colSpan={10} align="center">
            <Typography variant="body2">Error: {error.message}</Typography>
          </TableCell>
        </TableRow>
      )}
      {!error &&
        features.map((feature, index) =>
          renderRow(feature, index, currentPageFirstItemIndex + index),
        )}
    </TableBody>
  );
};

type AssetTablePaginationProps = {
  layerSpec: LayerSpec;
  fieldSpec: FieldSpec;
  page: number;
  pageSize: number;
  handleTablePaginationChange: (event: unknown, value: number) => void;
};
const AssetTablePagination: FC<AssetTablePaginationProps> = ({
  layerSpec,
  fieldSpec,
  page,
  pageSize,
  handleTablePaginationChange,
}) => {
  const { pageInfo } = useSortedFeatures(layerSpec, fieldSpec, page, pageSize);
  return (
    <TablePagination
      component={Box}
      sx={{
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '48px',
      }}
      count={pageInfo.total}
      page={page - 1}
      onPageChange={handleTablePaginationChange}
      rowsPerPage={pageSize}
      rowsPerPageOptions={[pageSize]}
    />
  );
};

const Loading = (
  <TableBody>
    <TableRow>
      <TableCell colSpan={10} align="center">
        <Typography variant="body2">Loading...</Typography>
      </TableCell>
    </TableRow>
  </TableBody>
);

export const SortedAssetTable: FC<{
  layerSpec: LayerSpec;
  fieldSpec: FieldSpec;
  header: ReactNode;
  renderRow: (feature: ListFeature, localIndex: number, globalIndex: number) => ReactNode;
  pageSize?: number;
}> = ({ layerSpec, fieldSpec, header, renderRow, pageSize = 20 }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [layerSpec, fieldSpec]);

  const handleTablePaginationChange = useCallback((event, value) => setPage(value + 1), [setPage]);

  return (
    <>
      <TableContainer component={Box} height="calc(100% - 48px)" overflow="scroll">
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>{header}</TableRow>
          </TableHead>

          <Suspense fallback={Loading}>
            <AssetTableBody
              layerSpec={layerSpec}
              fieldSpec={fieldSpec}
              page={page}
              pageSize={pageSize}
              renderRow={renderRow}
            />
          </Suspense>
        </Table>
      </TableContainer>
      <Suspense fallback={null}>
        <AssetTablePagination
          layerSpec={layerSpec}
          fieldSpec={fieldSpec}
          page={page}
          pageSize={pageSize}
          handleTablePaginationChange={handleTablePaginationChange}
        />
      </Suspense>
    </>
  );
};
