import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as moment from 'moment';
import {
  ToggleOff,
  ToggleOn,
  Share,
  Toys,
  FlashAuto,
  TouchApp,
  WbIncandescent,
  LocalDrink,
  Launch,
  Whatshot,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { Box } from '@material-ui/core';
import TimeAgo from 'react-timeago';
import enStrings from 'react-timeago/lib/language-strings/en';
import itaStrings from 'react-timeago/lib/language-strings/it';
import ruStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { useTheme } from '@material-ui/core/styles';
import i18n from './i18n/i18n';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Flip from 'react-reveal/Flip';
import Flash from 'react-reveal/Flash';
import WeekSchedule from './WeekSchedule';
/* MyFirst react Class. Don't blast me
04/2020 coronavirus past-time

@author shine@angelic.it
*/
//const itaFormat = buildFormatter(itaStrings);
//const engFormat = buildFormatter(enStrings);

const MODE_MANUAL = -1;
const MODE_AUTO = -2;

const getTimeAgoFormatter = (language) => {
  if (language === 'it') return buildFormatter(itaStrings);
  if (language === 'en') return buildFormatter(enStrings);
  if (language === 'ru') return buildFormatter(ruStrings);
};
getTimeAgoFormatter(i18n.language);

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  depositContext: {
    flex: 1,
  },
}));

export default function MinigrowlActuator(props) {
  const classes = useStyles();
  const theme = useTheme();
  const t = props.t;
  const actuator = props.value;
  const actuptime = props.uptime;
  const [updateInterval, setUpdateInterval] = React.useState('day');
  const [expanded, setExpanded] = React.useState(false);

  const [programOpen, setProgramOpen] = React.useState(false);

  const showModal = () => {
    console.log('         showModal: ');
    setProgramOpen(true);
  };

  const hideModal = () => {
    console.log('         hideModal: ');
    setProgramOpen(false);
  };

  //does not work
  const sortedCmds = actuator.cmds.sort((a, b) => a.name > b.name);
  //const dateT = Date(att.timeStamp);

  const df = new Intl.NumberFormat(i18n.language, {
    style: 'decimal',
    maximumSignificantDigits: 2,
  });

  function isComandEnabled(comando) {
    if (comando.val == MODE_MANUAL || comando.val == MODE_AUTO) {
      return actuator.mode == comando.val; //mode command
    } else {
      //real command
      return actuator.val == comando.val || actuator.mode == MODE_AUTO;
    }
  }

  function getDeviceIcon(device) {
    if (device.typ === 'FAN') return <Toys style={{ color: actuator.val == 1 ? theme.palette.success.light : '' }}></Toys>;
    if (device.typ === 'OUTTAKE')
      return <Launch style={{ color: actuator.val == 1 ? theme.palette.success.light : '' }}></Launch>;
    if (device.typ === 'LIGHT')
      return <WbIncandescent style={{ color: actuator.val == 1 ? theme.palette.success.light : '' }}></WbIncandescent>;
    if (device.typ === 'HVAC')
      return <Whatshot style={{ color: actuator.val == 1 ? theme.palette.success.light : '' }}></Whatshot>;
    if (device.typ === 'HUMIDIFIER')
      return <LocalDrink style={{ color: actuator.val == 1 ? theme.palette.success.light : '' }}></LocalDrink>;
    //default
    return <Share color={actuator.val == 1 ? 'primary' : 'secondary'}></Share>;
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);

    //if (!expanded) handleChangeUptimeInterval(updateInterval);
  };

  const handleChangeUptimeInterval = (option) => {
    setUpdateInterval(option);

    var now = new Date();
    now.setDate(now.getDate() + 1);

    var oneWeekAgo = new Date();
    switch (option) {
      case 'week':
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        break;
      case 'month':
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 30);
        break;
      case 'day':
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);
        break;
    }

    console.log('  ask uptime from: ' + moment(oneWeekAgo).format('YYYY-MM-DD HH:mm:ss'));
    console.log('               to: ' + moment(now).format('YYYY-MM-DD HH:mm:ss'));
    console.log('         timespan: ' + option);
    props.onAskUptime(
      actuator,
      moment(oneWeekAgo).format('YYYY-MM-DD HH:mm:ss'),
      moment(now).format('YYYY-MM-DD HH:mm:ss'),
      option,
    );
  };

  function getActuatorUptime(act, timespan) {
    var ret = -1;
    actuptime.forEach((element) => {
      if (element._id == act.actuatorId) {
        var sec = element.count / 1000;
        var hour = sec / 60 / 60;
        ret = hour;
      }
    });
    ret = df.format(ret);
    return ret;
  }
  //divide total hours by interval, to get daily avg
  function getActuatorUptimeDailyAvg(act) {
    var ret = -1;
    actuptime.forEach((element) => {
      if (element._id == act.actuatorId) {
        var sec = element.count / 1000;
        var hour = sec / 60 / 60;

        var interval = 0;

        switch (updateInterval) {
          case 'week':
            interval = 7;
            break;
          case 'month':
            interval = 31;
            break;
          case 'day':
            interval = 1;
            break;
        }

        var hourPerday = hour / interval;
        //console.log('ore diviso giorni' + hour + '/ ' + interval);
        ret = df.format(hourPerday);
      }
    });
    return ret;
  }

  const imageStr = '/static/' + actuator.typ + '.jpg';
  const titStr = t('devices:' + actuator.typ) + ' (on PIN ' + actuator.id + ')';
  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar img={imageStr} alt={titStr} className={classes.avatar}>
              {getDeviceIcon(actuator)}
            </Avatar>
          }
          title={titStr}
          subheader={
            <Flash spy={actuator.timeStamp}>
              <TimeAgo formatter={getTimeAgoFormatter(i18n.language)} date={new Date(actuator.timeStamp)} />
            </Flash>
          }
        />

        <CardMedia className={classes.media} image={imageStr} title="Device" />
        {actuator.type}
        <CardContent>
          <Flip left cascade spy={actuator.val}>
            <Typography style={{ color: actuator.val != 0 ? theme.palette.success.light : '' }} variant="h4" component="p">
              {actuator.val == 1 ? t('common:on') : t('common:off')}
            </Typography>
          </Flip>

          {actuator.err && <Alert severity="error">Dispositivo in errore!</Alert>}
        </CardContent>
        <CardActions disableSpacing>
          {t('common:commands')}
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="h6">
              {t('devices:mode')}: {actuator.mode == MODE_AUTO ? 'Auto' : 'Manual'}
            </Typography>
            <Typography paragraph>{t('devices:autodesc')}</Typography>
            <Typography paragraph>{t('devices:created')} {new Date(actuator.timeStampCreated).toLocaleString()}</Typography>
            <Typography color="textSecondary" className={classes.depositContext}></Typography>

            <Box display="flex" alignItems="center" justifyContent="center">
              <CardActions>
                <ButtonGroup orientation="vertical" color="primary" aria-label="vertical outlined primary button group">
                  {sortedCmds.map((comando) => (
                    <Button
                      disabled={isComandEnabled(comando)}
                      key={comando.name}
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={() => {
                        props.onClick(comando);
                      }}
                    >
                      {comando.val == MODE_MANUAL ? <TouchApp /> : ''}
                      {comando.val == MODE_AUTO ? <FlashAuto /> : ''}
                      {comando.val == 1 ? <ToggleOn /> : ''}
                      {comando.val == 0 ? <ToggleOff /> : ''} {t('commands:' + comando.name)}
                    </Button>
                  ))}
                  <WeekSchedule t={t} show={programOpen} value={props} handleClose={hideModal}></WeekSchedule>
                  <Button
                    key="programmato"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => {
                      showModal();
                    }}
                  >
                    <TouchApp />
                    Programmato
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Box>
            <Typography paragraph>
              {t('common:lastseen')}{' '}
              <TimeAgo formatter={getTimeAgoFormatter(i18n.language)} date={new Date(actuator.timeStamp)} />
            </Typography>

            <FormControl className={classes.formControl}>
              <span>
                <Typography>
                  {t('devices:litfor')}{' '}
                  {getActuatorUptime(actuator, updateInterval) == -1
                    ? ' ? '
                    : getActuatorUptime(actuator, updateInterval) + ' '}
                  {t('common:hour')} {t('devices:inthelast')}{' '}
                </Typography>
                <Select
                  labelId="select-uptime-range"
                  value={updateInterval}
                  onChange={(val) => {
                    handleChangeUptimeInterval(val.target.value);
                  }}
                >
                  <MenuItem key="w" value="week">
                    {t('common:week')}
                  </MenuItem>
                  <MenuItem key="d" value="day">
                    {t('common:day')}
                  </MenuItem>
                  <MenuItem key="m" value="month">
                    {t('common:month')}
                  </MenuItem>
                </Select>
                {updateInterval == 'day'
                  ? ''
                  : t('devices:daily', { uptime: getActuatorUptimeDailyAvg(actuator, updateInterval) })}
              </span>{' '}
            </FormControl>
          </CardContent>
        </Collapse>
      </Card>
    </React.Fragment>
  );
}
