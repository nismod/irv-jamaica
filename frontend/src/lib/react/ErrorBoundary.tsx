import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { Stack, StackProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Component, ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  message: string;
  justifyErrorContent?: StackProps['justifyContent'];
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <Box p={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent={this.props.justifyErrorContent}
            gap={1}
          >
            <ErrorOutline />
            <Typography>{this.props.message}</Typography>
          </Stack>
        </Box>
      );
    }
    return this.props.children;
  }
}
