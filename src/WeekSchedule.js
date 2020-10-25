import 'date-fns';
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DateFnsUtils from '@date-io/date-fns';
import DeleteIcon from '@material-ui/icons/Delete';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { format } from 'date-fns';
import { parse } from 'date-fns';
import { Alert } from '@material-ui/lab';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 400,
  },
}));

function createData(actuatorId, from, minFrom, to, minTo) {
  return { actuatorId: actuatorId, hourFrom: from, minuteFrom: minFrom, hourTo: to, minuteTo: minTo, cmd: {} };
}

export default function WeekSchedule(props) {
  const classes = useStyles();
  const attuatore = props.value.value;
  const errori = props.value.errori;
  const t = props.t;
  const attuatoreSchedule = props.value.actuatorSchedule;
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [selectedDateTo, setSelectedDateTo] = React.useState(new Date());
  const [selectedCommand, setSelectedCommand] = React.useState({});

  const handleMeetingDateChange = (e, row) => {
    console.log('ROW:' + row);
    console.log('handleMeetingDateChange E:' + e);
    setSelectedDate(e);
    // rest code goes here
  };
  const handleMeetingDateChangeTo = (e, row) => {
    console.log('ROW:' + row);
    console.log('handleMeetingDateChangeTo E:' + e);
    setSelectedDateTo(e);
    // rest code goes here
  };

  const handleCommandChange = (event) => {
    console.log('setSelectedCommand:' + event.target.value);
    setSelectedCommand(event.target.value);
  };

  const getDate = (preformatted) => {
    var result = parse(preformatted, 'k:mm', new Date());
    //console.log(format(result, 'hh:mm'));
    return result;
  };

  const getSelectedCommandByCommandId = (cmdId) => {
    console.log('getSelectedCommandByCommandId: ' + cmdId);
    let trid = {};
    const list = attuatore.cmds.map((command, j) => {
      var num = command.cid;
      var n = num.toString();

      // console.log('loop: ' + command.cid.toString() + cmdId.toString());
      if (n === cmdId) {
        trid = command;
      }
    });
    console.log(trid);
    return trid;
  };

  const addSched = () => {
    try {
      selectedCommand.tgt = attuatore.actuatorId;
      props.onAddSchedule(attuatore, selectedDate, selectedDateTo, selectedCommand);
    } catch (error) {
      console.log('USER ERROR ADD' + error);
      //this.setState({ isOnline: false });
    }
  };

  const deleteSched = (act, scheduleRow) => {
    console.log('DELETE CALL');
    props.onDeleteSchedule(act, scheduleRow);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'md'}
      open={props.show}
      onClose={props.handleClose}
      aria-labelledby="Mingrowl-board-chooser"
    >
      <DialogTitle id={'choose-prog-dialog-title' + attuatore.id}>Programmazione</DialogTitle>
      <DialogContent>
        {errori && <Alert severity="error">Impossibile aggiungere comando: {'' + errori}</Alert>}
        <DialogContentText>Impostazione del calendario per {t('devices:' + attuatore.typ)}</DialogContentText>
        <form className={classes.container} noValidate>
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {attuatoreSchedule.map((schedulerow) => {
                const comm = getSelectedCommandByCommandId(schedulerow.schedCmd);
                return (
                  <TableRow key={'trow' + schedulerow.actuatorScheduleId + attuatore.actuatorId}>
                    <TableCell scope="row">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          margin="normal"
                          id={schedulerow.actuatorScheduleId + 'ytime-picker'}
                          label="Da"
                          value={getDate(schedulerow.hourFrom + ':' + schedulerow.minuteFrom)}
                          disabled={true}
                          KeyboardButtonProps={{
                            'aria-label': 'change time',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </TableCell>
                    <TableCell align="right">
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                          margin="normal"
                          id={schedulerow.actuatorScheduleId + 'ytime-pickerto'}
                          value={getDate(schedulerow.hourTo + ':' + schedulerow.minuteTo)}
                          label="A"
                          disabled={true}
                          KeyboardButtonProps={{
                            'aria-label': 'change time',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </TableCell>
                    <TableCell align="right">
                      <FormControl className={classes.formControl}>
                        <InputLabel id={schedulerow.actuatorScheduleId + 'command-select-label'}>Comando</InputLabel>
                        <Select
                          labelId="selectd-scheduled-command"
                          id={'simple-select' + schedulerow.actuatorScheduleId}
                          value={-1}
                          disabled={true}
                        >
                          <MenuItem value={comm.val} key={comm.name}>
                            {' '}
                            {comm.name}
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right">
                      <FormControl className={classes.formControl}>
                        <Button
                          key={'delete' + schedulerow.actuatorScheduleId}
                          onClick={() => deleteSched(attuatore, schedulerow)}
                          variant="contained"
                          color="primary"
                          className={classes.button}
                        >
                          <DeleteIcon /> {t('commands:delete')}
                        </Button>
                      </FormControl>
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </form>

        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            <TableRow key={'ADDING-row'}>
              <TableCell scope="row">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    margin="normal"
                    id={'ADDINGytime-picker'}
                    label="Time picker"
                    value={selectedDate}
                    onChange={(e) => handleMeetingDateChange(e, selectedDate)}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </TableCell>
              <TableCell align="right">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardTimePicker
                    margin="normal"
                    id={'ADDINGytime-pickerto'}
                    value={selectedDateTo}
                    label="Time picker"
                    onChange={(e) => handleMeetingDateChangeTo(e, selectedDateTo)}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                </MuiPickersUtilsProvider>
              </TableCell>
              <TableCell align="right">
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-simple-select-label">Comando</InputLabel>
                  <Select
                    labelId="select new command to be scheduled"
                    id={'adding-cmd'}
                    value={selectedCommand}
                    onChange={handleCommandChange}
                  >
                    {attuatore.cmds.map((comando) => (
                      <MenuItem value={comando} key={comando.name}>
                        {' '}
                        {comando.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right">
                <Button key={'ADDINGcmd'} onClick={addSched} variant="contained" color="primary" className={classes.button}>
                  {t('commands:add')}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={props.handleClose} color="primary">
          {t('common:close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
