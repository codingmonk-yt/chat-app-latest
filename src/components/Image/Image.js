import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// @mui
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const Image = forwardRef(
  ({ disabledEffect = false, effect = 'blur', sx, ...other }, ref) => {
    const content = (
      <Box
        component={LazyLoadImage}
        wrapperClassName="wrapper"
        effect={disabledEffect ? undefined : effect}
        placeholderSrc={disabledEffect ? '/assets/transparent.png' : '/assets/placeholder.svg'}
        sx={{ width: 1, height: 1, objectFit: 'cover' }}
        {...other}
      />
    );

    return (
      <Box
        ref={ref}
        component="span"
        sx={{
          lineHeight: 1,
          display: 'block',
          overflow: 'hidden',
          position: 'relative',
          '& .wrapper': {
            width: 1,
            height: 1,
            backgroundSize: 'cover !important',
          },
          ...sx,
        }}
      >
        {content}
      </Box>
    );
  }
);

Image.propTypes = {
  sx: PropTypes.object,
  effect: PropTypes.string,
  disabledEffect: PropTypes.bool,
};

export default Image;
