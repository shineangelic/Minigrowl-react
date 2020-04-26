import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import i18n from './i18n/i18n'; // eslint-disable-line no-unused-vars
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
        <a
          onClick={() => {
            i18n.changeLanguage('it');
          }}
          style={{ paddingRight: '10px', fontSize: '25px', cursor: 'pointer' }}
        >
          <span>🇮🇹</span>
        </a>
        <a
          onClick={() => {
            i18n.changeLanguage('en');
          }}
          style={{ paddingRight: '10px', fontSize: '25px', cursor: 'pointer' }}
        >
          <span>🇬🇧</span>
        </a>
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
