import { Grid } from '@mui/material';
import { Children } from 'react';

export const InputRow = ({ children }) => (
  <Grid container spacing={1}>
    {Children.map(children, (child) => (
      <Grid size="grow">{child}</Grid>
    ))}
  </Grid>
);
