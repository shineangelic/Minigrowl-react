import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import { fade, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { AppBar, Typography, Toolbar } from '@material-ui/core';
import i18n from './i18n/i18n';
import { Eco, CheckCircleOutline, HighlightOff, ToggleOn, ToggleOff } from '@material-ui/icons';
import MoreIcon from '@material-ui/icons/MoreVert';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
}));

export default function MinigrowlAppBar(props) {
  const theme = useTheme();
  const classes = useStyles();
  const menuId = 'minigrowl-menu';
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleOptionsMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));
  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);

  const renderMenu = (
    <StyledMenu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      TransitionComponent={Fade}
    >
      <StyledMenuItem
        selected={i18n.language === 'it'}
        onClick={() => {
          i18n.changeLanguage('it');
          handleMenuClose();
        }}
      >
        <ListItemText primary="ITA" /> 🇮🇹
      </StyledMenuItem>
      <StyledMenuItem
        selected={i18n.language === 'en'}
        onClick={() => {
          handleMenuClose();
          i18n.changeLanguage('en');
        }}
      >
        <ListItemText primary="ENG" /> 🇬🇧
      </StyledMenuItem>
      <StyledMenuItem
        selected={i18n.language === 'ru'}
        onClick={() => {
          handleMenuClose();
          i18n.changeLanguage('ru');
        }}
      >
        <ListItemText primary="RUS" /> 🇷🇺
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          //handleMenuClose();
          props.onToggleWebSocket();
        }}
      >
        {props.value.isWebSocketEnabled ? (
          <ToggleOn>
            <InboxIcon fontSize="small" />
          </ToggleOn>
        ) : (
          <ToggleOff style={{ color: theme.palette.error.main }}>
            <InboxIcon fontSize="small" />
          </ToggleOff>
        )}
        <ListItemText primary="Websockets" />
      </StyledMenuItem>
    </StyledMenu>
  );

  return (
    <div className={classes.grow}>
      <AppBar color="inherit" position="static">
        <Toolbar>
          <Typography variant="h4" style={{ flexGrow: 1 }}>
            <Eco style={{ color: theme.palette.success.main }} />
            Minigrowl
          </Typography>

          <Typography variant="body2" style={{ flexGrow: 0 }}>
            board {props.value.activeBoard} - {props.value.isOnline ? 'Online' : 'Offline'}
          </Typography>

          {props.value.isOnline ? (
            <CheckCircleOutline style={{ color: theme.palette.success.main, marginLeft: 8 }}>Online</CheckCircleOutline>
          ) : (
            <HighlightOff style={{ color: theme.palette.error.main, marginLeft: 8 }}>Offline</HighlightOff>
          )}
          <IconButton
            variant="outlined"
            edge="end"
            aria-label="Minigrow options"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleOptionsMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
