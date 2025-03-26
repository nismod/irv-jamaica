import { Box, ClickAwayListener, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRecoilState } from 'recoil';

import { MapSearchField } from './MapSearchField';
import { placeSearchActiveState } from './search-state';

const blankSpaceWidth = 8;

export const MapSearch = ({ onSelectedResult }) => {
  const [expanded, setExpanded] = useRecoilState(placeSearchActiveState);

  return (
    <ClickAwayListener onClickAway={() => setExpanded(false)}>
      <Box style={{ display: 'inline-flex' }}>
        {/* display: inline-flex causes box to shrink to contents */}
        <Paper elevation={1}>
          <Box
            style={{ display: 'flex', flexDirection: 'row' }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setExpanded(false);
              }
            }}
          >
            <IconButton
              title="Search"
              onClick={() => setExpanded(!expanded)}
              style={{
                paddingInline: blankSpaceWidth,
                paddingBlock: blankSpaceWidth - 2,
                backgroundColor: 'white',
                color: 'black',
              }}
              size="large"
            >
              <SearchIcon />
            </IconButton>
            {expanded && (
              <Box style={{ marginRight: blankSpaceWidth }}>
                <MapSearchField onSelectedResult={onSelectedResult} />
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </ClickAwayListener>
  );
};
