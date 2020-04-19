import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Link from '@material-ui/core/Link';
import MinigrowlDashboard from './MinigrowlDashboard';
import { Client } from '@stomp/stompjs';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, Typography, createMuiTheme } from '@material-ui/core';
import MinigrowlAppBar from './MinigrowlAppBar';
import './Minigrowl.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const apiHost = '192.168.0.54'; // 192.168.0.54
const apiPort = '8000'; // 192.168.0.54
class Minigrowl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnline: false,
      sensors: [],
      actuators: [],
      chartData: [],
      chartSensor: {}, //selected chart
    };
  }
  onUpdateSensor = (updatedSensor) => {
    console.log('UPDATE ' + updatedSensor.id);

    const list = this.state.sensors.map((sensor, j) => {
      if (sensor.id === updatedSensor.id) {
        //e` lui!
        return updatedSensor;
      } else {
        return sensor;
      }
    });
    return list;
  };
  onUpdateActuator = (updatedActuator) => {
    console.log('UPDATE ' + updatedActuator.id);
    const list = this.state.actuators.map((act, j) => {
      if (act.id === updatedActuator.id) {
        return updatedActuator;
      } else {
        return act;
      }
    });
    return list;
  };
  webSock() {
    console.log('Component did mount');
    this.client = new Client();

    this.client.configure({
      brokerURL: `ws://${apiHost}:${apiPort}/minigrowl-ws/websocket`,
      onConnect: () => {
        console.log('onConnect');

        this.client.subscribe('/topic/sensors', (message) => {
          const sens = message.body;
          console.log('SENSORI ASYNC RECV' + sens);
          const slist = this.onUpdateSensor(JSON.parse(sens));
          ///ieeee aggiorno solo quello ciusto
          this.setState({
            isOnline: true,
            sensors: slist,
          });
        });
        this.client.subscribe('/topic/actuators', (message) => {
          const sens = message.body;
          console.log('ACT ASYNC RECV' + sens);
          const alist = this.onUpdateActuator(JSON.parse(sens));
          ///ieeee aggiorno solo quello ciusto
          this.setState({
            isOnline: true,
            actuators: alist,
          });
        });
      },
      // Helps during debugging, remove in production
      /*debug: (str) => {
        console.log(new Date(), str);
      },*/
    });

    this.client.activate();
  }
  askSensors() {
    //sensors = [];
    axios
      .get(`http://${apiHost}:${apiPort}/api/minigrowl/v1/sensors`)
      .then((response) => {
        const sensors = response.data;
        this.setState({ sensors, isOnline: true });
      })
      .catch(function (error) {
        this.setState({ isOnline: false });
        console.log(error);
      });
  }
  askActuators() {
    //sensors = [];
    axios
      .get(`http://${apiHost}:${apiPort}/api/minigrowl/v1/actuators`)
      .then((response) => {
        const actuators = response.data;
        this.setState({ actuators, isOnline: true });
      })
      .catch(function (error) {
        this.setState({ isOnline: false });
        console.log(error);
      });
  }
  askChartData(sensor) {
    //sensors = [];
    axios
      .get(`http://${apiHost}:${apiPort}/api/minigrowl/v1/sensors/${sensor.id}/hourChart`)
      .then((response) => {
        const chartDatar = response.data;
        this.setState({ chartData: chartDatar, chartSensor: sensor, isOnline: true });
      })
      .catch(function (error) {
        console.log(error);
        this.setState({ isOnline: false });
      });
  }

  componentDidMount() {
    this.askSensors();
    this.askActuators();
    this.webSock();
  }

  sendCommand(command) {
    console.log('Sending command:');
    console.log(command);
    axios
      .put(`http://${apiHost}:${apiPort}/api/minigrowl/v1/commands/queue/add`, command, {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      })

      .then((response) => {
        console.log('Comando eseguito');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <MinigrowlAppBar value={this.state} />

        <div className="App">
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <img src={logo} className="App-logo" alt="logo" />
          <Typography variant="h6">
            Gestione <code>Minigrowl</code>
          </Typography>
          <Link
            className="App-link"
            href="https://shineangelic.github.io/Minigrowl-spring/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Minigrowl: Opensource growroom controller
          </Link>

          <MinigrowlDashboard
            value={this.state}
            onAskChartData={(aboutWhichSensor) => this.askChartData(aboutWhichSensor)}
            onCommand={(whichCommand) => this.sendCommand(whichCommand)}
          />
        </div>
      </ThemeProvider>
    );
  }
}
export default Minigrowl;
