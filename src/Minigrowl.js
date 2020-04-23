import React from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, Typography, createMuiTheme } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { withTranslation } from 'react-i18next';
import logo from './logo.svg';
import MinigrowlDashboard from './MinigrowlDashboard';
import i18n from './i18n/i18n'; // eslint-disable-line no-unused-vars
import MinigrowlAppBar from './MinigrowlAppBar';
import './Minigrowl.css';
require('dotenv').config({ path: '/' });

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

//{process.env.REACT_APP_API_HOST}; //for example 192.168.0.54 must be defined in root folder's .env file
//{process.env.REACT_APP_API_PORT}; //same as above

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
      brokerURL: `wss://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/minigrowl-ws/websocket`,
      onConnect: () => {
        console.log('WEBSOCKET CONNECTED');

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
      onWebSocketError: () => {
        console.log('WEBSOCKET ERR');
      },
      // Helps during debugging, remove in production
      /*debug: (str) => {
        console.log(new Date(), str);
      },*/
    });

    // this.client.activate();
  }
  askSensors() {
    //sensors = [];
    axios
      .get(`https://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v1/sensors`)
      .then((response) => {
        const sensors = response.data;
        console.log('Received all SENSORS: ');
        console.log(sensors);
        this.setState({ sensors, isOnline: true });
      })
      .catch(function (error) {
        //this.setState({ isOnline: false });
        console.log(error);
      });
  }
  askActuators() {
    axios
      .get(`https://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v1/actuators`)
      .then((response) => {
        const actuators = response.data;
        console.log('Received all ACTUATORS: ');
        console.log(actuators);
        this.setState({ actuators, isOnline: true });
      })
      .catch(function (error) {
        //this.setState({ isOnline: false });
        console.log(error);
      });
  }
  askChartData(sensor) {
    axios
      .get(
        `https://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v1/sensors/${sensor.id}/hourChart`,
      )
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
      .put(
        `https://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v1/commands/queue/add`,
        command,
        {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        },
      )
      .then((response) => {
        console.log('Comando eseguito');
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { t } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <MinigrowlAppBar value={this.state} />

        <div className="App">
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <img src={logo} className="App-logo" alt="logo" />
          <Typography variant="h6">
            Gestione <code>{t('common:appName')}</code>
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
            t={t}
            value={this.state}
            onAskChartData={(aboutWhichSensor) => this.askChartData(aboutWhichSensor)}
            onCommand={(whichCommand) => this.sendCommand(whichCommand)}
            onAskAllSensors={() => this.askSensors()}
            onAskAllActuators={() => this.askActuators()}
          />
        </div>
      </ThemeProvider>
    );
  }
}

export default withTranslation()(Minigrowl);
