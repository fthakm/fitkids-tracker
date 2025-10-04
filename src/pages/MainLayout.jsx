import React from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function MainLayout({ children, onMenuToggle }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Box sx={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <AppBar position='sticky'><Toolbar><Typography variant='h6' sx={{ flexGrow:1 }}>FitKids Tracker</Typography>{isMobile && <IconButton color='inherit' onClick={onMenuToggle}><MenuIcon/></IconButton>}</Toolbar></AppBar>
      <Box sx={{ p:2 }}>{children}</Box>
    </Box>
  );
}
