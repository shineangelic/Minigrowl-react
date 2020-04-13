import React from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TimeAgo } from '@n1ru4l/react-time-ago';
import { ErrorOutline } from '@material-ui/icons';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function SensorsTab(props) {
  const classes = useStyles();
  const attuatori = props.value;

  return (
    <React.Fragment>
      <Title>Recent Readings</Title>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Misura</TableCell>
            <TableCell>Errori</TableCell>
            <TableCell>Last seen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attuatori.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.typ}</TableCell>
              <TableCell>
                {row.val}
                {row.uinit}
              </TableCell>
              <TableCell>{row.err ? <ErrorOutline color="error"></ErrorOutline> : ''}</TableCell>
              <TableCell>
                <TimeAgo date={new Date(row.timeStamp)} render={({ error, value }) => <span>{value}</span>} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more orders
        </Link>
      </div>
    </React.Fragment>
  );
}
