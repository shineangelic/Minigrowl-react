import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ScheduleSelector from 'react-schedule-selector';
import styled from 'styled-components';


const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 600,
  },
}));

export default function WeekSchedule(props) {
  const classes = useStyles();
  const attuatore = props.value.value;
  const t = props.t;
  const  [schedule,setSchedule] = React.useState([]);
  const theme = useTheme();

  const handleChange = newSchedule => {
    //TODO send schedule
    setSchedule(newSchedule); 
  }
   
  const ScheduleSelectorCard = styled.div`
  color:white !important;
  border-radius: 5px;
  padding: 10px;
  width: 90%;
  & > * {
    flex-grow: 1;
  }
`
 
  return ( 
    <Dialog
          fullWidth={true}
          open={props.show}
          onClose={props.handleClose}
          aria-labelledby="Mingrowl-board-chooser"
        >
          <DialogTitle id= {"choose-prog-dialog-title" +attuatore.id}>
              Programmazione 
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Impostazione del calendario per {t('devices:' + attuatore.typ)}
            </DialogContentText>
              <Paper>
              <ScheduleSelectorCard>
                <ScheduleSelector
                labelColor="white"
                  selection={schedule}
                  minTime={0}
                  maxTime={24}
                  hoverColor={theme.palette.secondary.light}
                  selectedColor={theme.palette.primary.light}
                  dateFormat="ddd"
                  hourlyChunks={1}
                  onChange={handleChange}
                />
                </ScheduleSelectorCard>
              </Paper>
            </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={props.handleClose} color="primary">
              {t('common:close')}
            </Button>
          </DialogActions>
        </Dialog>
    
  );
}
