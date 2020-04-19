import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { AppBar, Typography, createMuiTheme, Toolbar } from '@material-ui/core';
import { Eco, Dns } from '@material-ui/icons';

export default function MinigrowlAppBar(props) {
  const theme = useTheme();

  return (
    <AppBar color="inherit" position="static">
      <Toolbar>
        <Typography variant="h4" style={{ flexGrow: 1 }}>
          <Eco style={{ color: theme.palette.success.main }} />
          Minigrowl
        </Typography>
        <Typography variant="body2" style={{ flexGrow: 0 }}>
          {props.value.isOnline ? 'Online' : 'Offline'}
        </Typography>
        <Dns style={{ color: props.value.isOnline == 1 ? theme.palette.success.main : theme.palette.error.main }}>
          {props.value.isOnline ? 'Online' : 'Offline'}
        </Dns>
      </Toolbar>
    </AppBar>
  );
}
