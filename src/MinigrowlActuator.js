import React from 'react';
import clsx from 'clsx';
import Link from '@material-ui/core/Link';
import { TimeAgo } from '@n1ru4l/react-time-ago';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Title from './Title';
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
import { red } from '@material-ui/core/colors';
import { ToggleOff, ToggleOn, Share, ContactMailRounded, FlashAuto, TouchApp } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { Box } from '@material-ui/core';

function preventDefault(event) {
  event.preventDefault();
}

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
  avatar: {
    backgroundColor: red[500],
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
  const MODE_MANUAL = -1;
  const MODE_AUTO = -2;
  function isEnabledComando(comando) {
    if (comando.val == MODE_MANUAL || comando.val == MODE_AUTO) {
      return att.mode == comando.val; //mode command
    } else {
      //real command
      return att.val == comando.val || att.mode == MODE_AUTO;
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <React.Fragment>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              R
            </Avatar>
          }
          title={
            <Title>
              {att.typ} (on PIN {att.id})
            </Title>
          }
          subheader={
            <TimeAgo date={new Date(att.timeStamp)} render={({ error, value }) => <span>Last seen: {value}</span>} />
          }
        />
        <CardMedia className={classes.media} image="/static/grow.jpg" title="Lights" />
        <CardContent>
          <Typography variant="h4" component="p">
            {att.val}
          </Typography>
          {att.err && <Alert severity="error">Dispositivo in errore!</Alert>}
        </CardContent>
        <CardActions disableSpacing>
          COMMANDS
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
            <Typography paragraph>Method: {att.mode == MODE_AUTO ? 'Auto' : 'Manual'}</Typography>
            <Typography paragraph>
              La modalita` AUTO segue la programmazione definita sulla scheda e disabilita i comandi manuali
            </Typography>
            <Typography color="textSecondary" className={classes.depositContext}></Typography>
            Last seen <TimeAgo date={new Date(att.timeStamp)} render={({ error, value }) => <span>{value}</span>} />
            {att.cmds.map((comando) => (
              <Box display="flex" alignItems="center" justifyContent="center">
                <CardActions disableSpacing>
                  <Button
                    disabled={isEnabledComando(comando)}
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
            <div>
              <Link color="primary" href="#" onClick={preventDefault}>
                View balance
              </Link>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </React.Fragment>
  );
}
