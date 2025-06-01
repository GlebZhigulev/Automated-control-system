import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.default', py: 2, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="body1">Автоматизированная система "Дорожный контроль"</Typography>
      <Typography variant="body2">Телефон: +7 (999) 123-45-67</Typography>
    </Box>
  );
};

export default Footer;
