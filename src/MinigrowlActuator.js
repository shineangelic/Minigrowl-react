import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ToggleOff, ToggleOn, Share, Toys, FlashAuto, TouchApp, WbIncandescent, Opacity } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { Box } from '@material-ui/core';
import TimeAgo from 'react-timeago';
import frenchStrings from 'react-timeago/lib/language-strings/it';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const formatter = buildFormatter(frenchStrings);
function preventDefault(event) {
  event.preventDefault();
}

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

  const att = props.value;
  const dateT = Date(att.timeStamp);
  const [expanded, setExpanded] = React.useState(false);

  function isComandEnabled(comando) {
    if (comando.val == MODE_MANUAL || comando.val == MODE_AUTO) {
      return att.mode == comando.val; //mode command
    } else {
      //real command
      return att.val == comando.val || att.mode == MODE_AUTO;
    }
  }

  function getDeviceIcon(device) {
    if (device.typ == 'FAN') return <Toys color={att.val == 1 ? 'primary' : 'secondary'}></Toys>;
    if (device.typ == 'LIGHT') return <WbIncandescent color={att.val == 1 ? 'primary' : 'secondary'}></WbIncandescent>;
    //default
    return <Share color={att.val == 1 ? 'primary' : 'secondary'}></Share>;
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const imageStr = '/static/' + att.typ + '.jpg';
  const titStr = att.typ + ' (on PIN ' + att.id + ')';
  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar img={imageStr} alt={titStr} className={classes.avatar}>
              {getDeviceIcon(att)}
            </Avatar>
          }
          title={titStr}
          subheader={
            <TimeAgo
              formatter={formatter}
              date={new Date(att.timeStamp)}
              render={({ error, value }) => <span>{value}</span>}
            />
          }
        />

        <CardMedia className={classes.media} image={imageStr} title="Lights" />
        {att.type}
        <CardContent>
          <Typography variant="h4" component="p">
            {att.val == 1 ? 'Acceso' : 'Spento'}
          </Typography>
          {att.err && <Alert severity="error">Dispositivo in errore!</Alert>}
        </CardContent>
        <CardActions disableSpacing>
          COMANDI
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
            <Typography paragraph>Modalità: {att.mode == MODE_AUTO ? 'Auto' : 'Manual'}</Typography>
            <Typography paragraph>
              La modalita` AUTO segue la programmazione definita sulla scheda e disabilita i comandi manuali
            </Typography>
            <Typography color="textSecondary" className={classes.depositContext}></Typography>
            {att.cmds.map((comando) => (
              <Box display="flex" alignItems="center" justifyContent="center">
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
                    {comando.name}
                  </Button>
                </CardActions>
              </Box>
            ))}

            <Typography paragraph>
              Ultimo contatto{' '}
              <TimeAgo
                formatter={formatter}
                date={new Date(att.timeStamp)}
                render={({ error, value }) => <span>{value}</span>}
              />
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </React.Fragment>
  );
}
