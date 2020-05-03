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
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import { useTheme } from '@material-ui/core/styles';
import i18n from './i18n/i18n';
/* MyFirst react Class. Don't blast me
04/2020 coronavirus past-time

@author shine@angelic.it
*/
const itaFormat = buildFormatter(itaStrings);
const engFormat = buildFormatter(enStrings);

const MODE_MANUAL = -1;
const MODE_AUTO = -2;

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
  //does not work
  const sortedCmds = actuator.cmds.sort((a, b) => a.name > b.name);
  //const dateT = Date(att.timeStamp);
  const [expanded, setExpanded] = React.useState(false);

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
  };

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
            <TimeAgo formatter={i18n.language === 'it' ? itaFormat : engFormat} date={new Date(actuator.timeStamp)} />
          }
        />

        <CardMedia className={classes.media} image={imageStr} title="Device" />
        {actuator.type}
        <CardContent>
          <Typography style={{ color: actuator.val != 0 ? theme.palette.success.light : '' }} variant="h4" component="p">
            {actuator.val == 1 ? t('common:on') : t('common:off')}
          </Typography>
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
            <Typography paragraph>
              {t('devices:mode')}: {actuator.mode == MODE_AUTO ? 'Auto' : 'Manual'}
            </Typography>
            <Typography paragraph>{t('devices:autodesc')}</Typography>
            <Typography color="textSecondary" className={classes.depositContext}></Typography>

            {sortedCmds.map((comando) => (
              <Box key={comando.name} display="flex" alignItems="center" justifyContent="center">
                <CardActions>
                  <Button
                    fullWidth
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
                    {comando.val == 0 ? <ToggleOff /> : ''}
                    {t('commands:' + comando.name)}
                  </Button>
                </CardActions>
              </Box>
            ))}

            <Typography paragraph>
              Ultimo contatto{' '}
              <TimeAgo formatter={i18n.language === 'it' ? itaFormat : engFormat} date={new Date(actuator.timeStamp)} />
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </React.Fragment>
  );
}
