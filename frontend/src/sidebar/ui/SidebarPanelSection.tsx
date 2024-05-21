import { Box } from '@mui/material';
import { FC, ReactNode } from 'react';

export const SidebarPanelSection: FC<{
  children: ReactNode;
  variant?: 'standard' | 'style';
}> = ({ children, variant = 'standard' }) => {
  const bgcolor = variant === 'style' ? '#eee' : undefined;
  return (
    <Box p={2} bgcolor={bgcolor}>
      {children}
    </Box>
  );
};
