import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import MinigrowlActuator from './MinigrowlActuator';
import SensorsTab from './SensorsTab';
import SensorsChart from './SensorChart';
import FormControl from '@material-ui/core/FormControl';

import './Minigrowl.css';
import { Button } from '@material-ui/core';

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
      Shine - 03/2020
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
    height: 360,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function MinigrowlDashboard(props) {
  const classes = useStyles();
  const sensors = props.value.sensors;
  const actuators = props.value.actuators;

  function handleActuatorClick(comman) {
    props.onCommand(comman);
  }
  const { t } = props;
  return (
    <Container maxWidth="lg" className={classes.container}>
      <Grid item xs={12}>
        <Grid
          container
          spacing={3}
          justify="space-between" // Add it here :)
        >
          <Grid item>
            <Typography variant="h3">{t('devices:devices')}</Typography>
          </Grid>
          <Grid item>
            <FormControl className={classes.formControl}>
              <Button onClick={() => props.onAskAllActuators()}>{t('common:refresh')}</Button>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {actuators.map((senso) => (
          <Grid key={senso.id} item xs={12} md={4} lg={3} sm={6}>
            <Paper>
              <MinigrowlActuator t={t} value={senso} onClick={(sens) => handleActuatorClick(sens)} />
            </Paper>
          </Grid>
        ))}
        <div className={classes.appBarSpacer} />
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            justify="space-between" // Add it here :)
          >
            <Grid item>
              <Typography variant="h3">{t('sensors:sensors')}</Typography>
            </Grid>
            <Grid item>
              <FormControl className={classes.formControl}>
                <Button onClick={() => props.onAskAllSensors()}>{t('common:refresh')}</Button>
              </FormControl>
            </Grid>
          </Grid>

          <Paper className={classes.paper}>
            <SensorsTab t={t} value={sensors} />
          </Paper>
        </Grid>

        <SensorsChart t={t} value={props} chartSensor={props.value.chartSensor} chartData={props.value.chartData} />

        <SensorsChart
          t={t}
          value={props}
          hist={true}
          chartSensor={props.value.chartHistSensor}
          chartData={props.value.chartHistData}
        />
      </Grid>
      <Box pt={4}>
        <Copyright />
      </Box>
    </Container>
  );
}
