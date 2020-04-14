import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MinigrowlActuator from './MinigrowlActuator';
import SensorsTab from './SensorsTab';

import './Minigrowl.css';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="https://github.com/shineangelic/Minigrowl-ESP-LoRa32-OLED">
        Made with{' '}
        <span role="img" aria-label="Love">
          ❤️
        </span>{' '}
        in Bologna by
      </Link>{' '}
      Shine - {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export default function MinigrowlDashboard(props) {
  const classes = useStyles();
  const sensors = props.value.sensors;
  const actuators = props.value.actuators;
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  function handleClick(comman) {
    props.onCommand(comman);
  }
  return (
    <Container maxWidth="lg" className={classes.container}>
      <div></div>
      <Typography variant="h3">Dispositivi</Typography>
      <Grid container spacing={3}>
        {/* Recent Deposits */}

        {actuators.map((senso) => (
          <Grid key={senso.id} item xs={12} md={4} lg={3} sm={6}>
            <Paper>
              <MinigrowlActuator value={senso} onClick={(sens) => handleClick(sens)} />
            </Paper>
          </Grid>
        ))}
        <div className={classes.appBarSpacer} />
        <Grid item xs={12}>
          <Typography variant="h3">Sensori</Typography>
          <Paper className={classes.paper}>{<SensorsTab value={sensors} />}</Paper>
        </Grid>
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
}
