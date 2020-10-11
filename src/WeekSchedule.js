import * as React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

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
  const attuatore = props.value;
  const t = props.t;
  const showHideClassName = props.show ? 'modal display-block' : 'modal display-none';

  const df = new Intl.DateTimeFormat(t.language, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return (
    <Dialog
          fullWidth={true}
          maxWidth="sm"
          open={props.show}
          onClose={props.handleClose}
          aria-labelledby="Mingrowl-board-chooser"
        >
          <DialogTitle id="choose-board-dialog-title">
            <Typography variant="h5">
              Programmazio
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Impostazione del calendario
            </DialogContentText>
             
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={props.handleClose} color="primary">
              {t('common:close')}
            </Button>
          </DialogActions>
        </Dialog>
    
  );
}
