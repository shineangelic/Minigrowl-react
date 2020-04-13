import React from 'react';
import Link from '@material-ui/core/Link';
import Moment from 'react-moment';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

export default function GrowlSensor(props) {
  const classes = useStyles();

  const sensore = props;
  const date = Date(sensore.value.timeStamp);

  //const formattedDate = Moment(date).format('LL');
  return (
    <React.Fragment>
      <Title>{sensore.value.typ}</Title>
      <Typography variant="h4">
        {sensore.value.val}
        {sensore.value.uinit}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {date}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          View balance
        </Link>
      </div>
    </React.Fragment>
  );
}
