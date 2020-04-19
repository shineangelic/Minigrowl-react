import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Link from '@material-ui/core/Link';
import MinigrowlDashboard from './MinigrowlDashboard';
import { Client } from '@stomp/stompjs';
import './Minigrowl.css';
import update from 'react-addons-update'; // ES6
import { ThemeProvider } from '@material-ui/styles';

import { AppBar, CssBaseline, Typography, createMuiTheme } from '@material-ui/core';
import { Eco } from '@material-ui/icons';

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
      sensors: [],
      actuators: [],
      chartData: [],
      chartSensor: {},
      xIsNext: true,
    };
  }
  onUpdateItem = (updatedSensor) => {
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
        //e` lui!
        return updatedActuator;
      } else {
        return act;
      }
    });
    return list;
  };
  webSock() {
    console.log('Component did mount');
    // The compat mode syntax is totally different, converting to v5 syntax
    // Client is imported from '@stomp/stompjs'
    this.client = new Client();

    this.client.configure({
      brokerURL: `ws://${apiHost}:${apiPort}/minigrowl-ws/websocket`,
      onConnect: () => {
        console.log('onConnect');

        this.client.subscribe('/topic/sensors', (message) => {
          const sens = message.body;
          console.log('SENSORI ASYNC RECV' + sens);
          const newSensor = JSON.parse(sens);
          const slist = this.onUpdateItem(newSensor);
          ///ieeee aggiorno solo quello ciusto
          this.setState({
            sensors: slist,
          });
        });
        this.client.subscribe('/topic/actuators', (message) => {
          const sens = message.body;
          console.log('ACT ASYNC RECV' + sens);
          const actuator = JSON.parse(sens);
          const alist = this.onUpdateActuator(actuator);
          ///ieeee aggiorno solo quello ciusto
          this.setState({
            actuators: alist,
          });
        });
      },
      // Helps during debugging, remove in production
      debug: (str) => {
        console.log(new Date(), str);
      },
    });

    this.client.activate();
    //this.client.send('/sensors', { priority: 9 }, 'Hello, STOMP');
  }
  askSensors() {
    //sensors = [];
    axios
      .get(`http://${apiHost}:${apiPort}/api/minigrowl/v1/sensors`)
      .then((response) => {
        const sensors = response.data;
        this.setState({ sensors });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  askActuators() {
    //sensors = [];
    axios
      .get(`http://${apiHost}:${apiPort}/api/minigrowl/v1/actuators`)
      .then((response) => {
        const actuators = response.data;
        this.setState({ actuators });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  askChartData(sensor) {
    //sensors = [];
    axios
      .get(`http://${apiHost}:${apiPort}/api/minigrowl/v1/sensors/${sensor.id}/hourChart`)
      .then((response) => {
        const chartDatar = response.data;
        this.setState({ chartData: chartDatar, chartSensor: sensor });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  // componentWillMount() {
  // this.webSock();
  //}
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
        <AppBar color="inherit">
          <Eco />
          <Typography variant="h4">Minigrowl</Typography>
        </AppBar>

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
            onAskChartData={(sens) => this.askChartData(sens)}
            onCommand={(com) => this.sendCommand(com)}
          />
        </div>
      </ThemeProvider>
    );
  }
}
export default Minigrowl;
