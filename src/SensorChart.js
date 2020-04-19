import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';

export default function SensorChart(props) {
  const theme = useTheme();
  console.log(props.value.value);
  const dataSerie = props.value.value.chartData;

  return (
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
              {props.value.value.chartSensor.uinit}
            </Label>
          </YAxis>

          <Line type="monotone" dataKey="min" stroke={theme.palette.primary.dark} />
          <Line type="monotone" dataKey="max" stroke={theme.palette.error.light} />
          <Line type="monotone" dataKey="value" stroke={theme.palette.primary.contrastText} />
          <Tooltip
            labelStyle={{ color: theme.palette.primary.dark }}
            itemStyle={{ color: theme.palette.primary.dark }}
            labelFormatter={function (value) {
              return `Ore: ${value}`;
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
