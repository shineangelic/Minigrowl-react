import React from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline, Typography, createMuiTheme } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { withTranslation } from 'react-i18next';
import logo from './logo.svg';
import MinigrowlDashboard from './MinigrowlDashboard';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import MinigrowlAppBar from './MinigrowlAppBar';
import enStrings from 'react-timeago/lib/language-strings/en';
import itaStrings from 'react-timeago/lib/language-strings/it';
import ruStrings from 'react-timeago/lib/language-strings/ru';
import i18n from './i18n/i18n';
import './Minigrowl.css';
require('dotenv').config({ path: '/' });

/* MyFirst react Class. Don't blast me
04/2020 coronavirus past-time

@author shine@angelic.it
*/
const itaFormat = buildFormatter(itaStrings);
const engFormat = buildFormatter(enStrings);
const ruFormat = buildFormatter(ruStrings);

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
      isWebSocketEnabled: true,
      isOnline: false,
      sensors: [],
      actuators: [],
      chartData: [],
      chartSensor: {}, //selected chart
      chartHistData: [],
      chartHistSensor: {}, //selected chart history
      lastESPContact: new Date(),
      actuatorsUptime: [{}],
    };
  }
  onUpdateSensor = (updatedSensor) => {
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
  onUpdateUptime = (singleUptime, act, timespan) => {
    if (singleUptime) {
      //togli quello pertinente
      const list = this.state.actuatorsUptime.filter(
        (item, j) => singleUptime._id !== item._id || timespan !== item.timeSpan,
      );
      singleUptime.timeSpan = timespan;
      const catted = list.concat(singleUptime); //rimettilo
      return catted;
    } else {
      //puo ancora non esserci
      const list = this.state.actuatorsUptime;
      return list.concat({ _id: act.id, count: 0, timeSpan: timespan });
    }
  };
  onUpdateActuator = (updatedActuator) => {
    //console.log('UPDATE ' + updatedActuator.id);
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
    if (this.state.isWebSocketEnabled) {
      console.log('OPENING WEBSOCKET');
      this.client.activate();
    } else {
      console.log('DEACTIVATING WEBSOCKET');
      this.client.deactivate();
    }
  }
  //called from menu
  toggleWebSocket() {
    const tf = !this.state.isWebSocketEnabled;
    this.setState({ isWebSocketEnabled: tf }, () => {
      console.log('TOGGLE WEBSOCKETS:' + this.state.isWebSocketEnabled);
      this.webSock();
    });
  }
  getLastContact(props) {
    var m1 = this.getLastSensorsContact(props.actuators);
    var m2 = this.getLastSensorsContact(props.sensors);

    return m1 > m2 ? m1 : m2;
  }
  getLastActuatorsContact(props) {
    var maxdate = new Date();
    maxdate.setDate(maxdate.getDate() - 100);
    props.forEach((act) => {
      if (new Date(act.timeStamp) > maxdate) {
        maxdate = new Date(act.timeStamp);
      }
    });
    return maxdate;
  }
  getLastSensorsContact(props) {
    var maxdate = new Date();
    maxdate.setDate(maxdate.getDate() - 100);
    props.forEach((act) => {
      if (new Date(act.timeStamp) > maxdate) {
        maxdate = new Date(act.timeStamp);
      }
    });
    return maxdate;
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
    //also forward the request to ESP to speed it up
    this.issueFullRefresh();
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
    //also forward the request to ESP to speed it up
    this.issueFullRefresh();
  }

  askActuatorUptime(actuat, dtIn, dtOut, timeSpan) {
    axios
      .get(`https://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v1/actuators/uptime`, {
        params: {
          dataInizio: dtIn,
          dataFine: dtOut,
          actuatorId: actuat.id,
        },
      })
      .then((response) => {
        const uptimeArr = response.data;
        console.log('Received UPTIME: ');
        console.log(uptimeArr[0]);
        const slist = this.onUpdateUptime(uptimeArr[0], actuat, timeSpan);
        console.log('UPTIMES: ');
        console.log(slist);
        this.setState({
          isOnline: true,
          actuatorsUptime: slist,
        });
        // this.setState({ actuatorsUptime: uptimeArr });
      })
      .catch(function (error) {
        //this.setState({ isOnline: false });
        console.log(error);
      });
  }
  issueFullRefresh() {
    axios
      .put(
        `https://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v1/commands/fullRefresh`,
        '',
        {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        },
      )
      .then((response) => {
        const cnt = response.data;
        console.log('Issued full async refresh: ');
        console.log('Server commands queue size: ' + cnt);
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
        //this.setState({ isOnline: false });
      });
  }
  askChartDataHistory(sensor) {
    axios
      .get(
        `https://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v1/sensors/${sensor.id}/historyChart`,
      )
      .then((response) => {
        const chartDatar = response.data;
        console.log('GOT HISTORY DATA');
        this.setState({ chartHistData: chartDatar, chartHistSensor: sensor, isOnline: true });
      })
      .catch(function (error) {
        console.log(error);
        //this.setState({ isOnline: false });
      });
  }

  componentDidMount() {
    this.askSensors();
    this.askActuators();
    this.webSock();
    //this.askLastContact();
  }
  componentWillUnmount() {
    this.client.deactivate();
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

        <MinigrowlAppBar value={this.state} onToggleWebSocket={() => this.toggleWebSocket()} />

        <div className="App">
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <img src={logo} className="App-logo" alt="Minigrowl logo" />
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
          <Typography>
            {' '}
            <TimeAgo
              formatter={i18n.language === 'it' ? itaFormat : engFormat}
              date={this.getLastContact(this.state)}
            />{' '}
          </Typography>
          <MinigrowlDashboard
            t={t}
            value={this.state}
            onAskChartData={(aboutWhichSensor) => this.askChartData(aboutWhichSensor)}
            onAskLastContact={(sensors) => this.getLastSensorsContact(sensors)}
            onAskUptime={(actuator, from, to, timeSpan) => this.askActuatorUptime(actuator, from, to, timeSpan)}
            onAskHistoryData={(aboutWhichSensor) => this.askChartDataHistory(aboutWhichSensor)}
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
