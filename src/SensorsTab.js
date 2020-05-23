import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { ErrorOutline } from '@material-ui/icons';
import TableContainer from '@material-ui/core/TableContainer';
import Reveal from 'react-reveal/Reveal';
import Flash from 'react-reveal/Flash';
import { Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 600,
  },
}));

export default function SensorsTab(props) {
  const classes = useStyles();
  const sensori = props.value;
  const lastT = props.lastESPContact;
  const t = props.t;

  return (
    <React.Fragment>
      <TableContainer>
        <Table className={classes.table} size="medium">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('sensors:type')}</TableCell>
              <TableCell>{t('sensors:measure')}</TableCell>
              <TableCell>{t('common:lastseen')}</TableCell>
              <TableCell>{t('sensors:error')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sensori.map((row, i) => (
              <TableRow key={row.id}>
                <TableCell component="th">
                  <Flash effect={classes.red} spy={row.timeStamp}>
                    {row.id}
                  </Flash>
                </TableCell>
                <TableCell>{t('sensors:' + row.typ)}</TableCell>
                <TableCell>
                  <Flash spy={row.timeStamp}>
                    <Typography>
                      {row.val}
                      {row.uinit}
                    </Typography>
                  </Flash>
                </TableCell>
                <TableCell>
                  <Flash spy={row.timeStamp}>{new Date(row.timeStamp).toLocaleTimeString()}</Flash>
                </TableCell>
                <TableCell>
                  <Flash spy={row.timeStamp}>{row.err ? <ErrorOutline color="error"></ErrorOutline> : ''}</Flash>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={classes.seeMore}>
        {t('common:lastseen')} {lastT}
      </div>
    </React.Fragment>
  );
}
