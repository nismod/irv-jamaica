import { LinkProps, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export const ExtLink = ({ ...props }: Omit<LinkProps<'a'>, 'component'>) => {
  return <MuiLink target="_blank" rel="noopener noreferrer" {...props} />;
};

export const AppLink = ({ ...props }: Omit<RouterLinkProps, 'component'>) => {
  return <MuiLink component={RouterLink} {...props} />;
};
