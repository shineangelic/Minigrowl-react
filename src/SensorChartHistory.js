import React from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 360,
  },
}));

export default function SensorChartHistory(props) {
  const theme = useTheme();
  const classes = useStyles();
  const dataSerie = props.chartHistData;
  const chartHistSensor = props.chartHistSensor;
  const sensors = props.value.value.sensors;

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const { t } = props;
  const handleChangeHistChart = (event) => {
    // async chart data req
    props.value.onAskHistoryData(event.target.value);
  };
  return (
    <Grid item xs={12}>
      <Grid
        container
        spacing={3}
        justify="space-between" // Add it here :)
      >
        <Grid item>
          <Typography variant="h3">{t('common:history')}</Typography>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">{t('sensors:sensor')}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chartHistSensor}
              onChange={handleChangeHistChart}
            >
              {sensors.map((sensorchart) => (
                <MenuItem key={sensorchart.id} value={sensorchart}>
                  {sensorchart.typ} ({sensorchart.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Paper className={fixedHeightPaper}>
        <React.Fragment>
          <ResponsiveContainer>
            <LineChart
              data={dataSerie}
              margin={{
                top: 16,
                right: 16,
                bottom: 16,
                left: 16,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" stroke={theme.palette.text.secondary}>
                <Label angle={0} position="bottom" style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}>
                  Ora
                </Label>
              </XAxis>

              <YAxis stroke={theme.palette.text.secondary}>
                <Label angle={270} position="left" style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}>
                  {chartHistSensor.uinit}
                </Label>
              </YAxis>

              <Line type="monotone" dataKey="min" stroke={theme.palette.primary.dark} />
              <Line type="monotone" dataKey="max" stroke={theme.palette.error.light} />
              <Line type="monotone" dataKey="value" stroke={theme.palette.primary.contrastText} />
              <Tooltip
                labelStyle={{ color: theme.palette.primary.dark }}
                itemStyle={{ color: theme.palette.primary.dark }}
                labelFormatter={function (value) {
                  return `Data: ${value}`;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </React.Fragment>
      </Paper>
    </Grid>
  );
}
