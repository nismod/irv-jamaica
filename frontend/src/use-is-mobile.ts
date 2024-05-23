import { Theme, useMediaQuery } from '@mui/material';

export function useIsMobile() {
  return useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
}
