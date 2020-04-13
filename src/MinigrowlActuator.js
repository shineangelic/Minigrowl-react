import React from 'react';
import clsx from 'clsx';
import Link from '@material-ui/core/Link';
import { TimeAgo } from '@n1ru4l/react-time-ago';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

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
import { ToggleOff, ToggleOn, Share, ContactMailRounded } from '@material-ui/icons';

import MoreVertIcon from '@material-ui/icons/MoreVert';

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
          subheader={<TimeAgo date={new Date(att.timeStamp)} render={({ error, value }) => <span>{value}</span>} />}
        />
        <CardMedia className={classes.media} image="/static/reflectors.jpg" title="Lights" />
        <CardContent>
          <Typography variant="h4" component="p">
            {att.val}
          </Typography>
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
            <Typography paragraph>Method:</Typography>
            <Typography paragraph>La luce in modalita` AUTO segue la programmazione definita sulla scheda</Typography>
            <Typography color="textSecondary" className={classes.depositContext}></Typography>
            Last seen <TimeAgo date={new Date(att.timeStamp)} render={({ error, value }) => <span>{value}</span>} />
            {att.cmds.map((comando) => (
              <Button
                key={comando.name}
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  props.onClick(comando);
                }}
              >
                {comando.val == 1 ? <ToggleOn /> : <ToggleOff />}
                {comando.name}
              </Button>
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
