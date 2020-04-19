import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';

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
            bottom: 12,
            left: 16,
          }}
        >
          <XAxis dataKey="id" stroke={theme.palette.text.secondary} />

          <YAxis stroke={theme.palette.text.secondary}>
            <Label angle={270} position="left" style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}>
              {props.value.value.chartSensor.uinit}
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} />

          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
