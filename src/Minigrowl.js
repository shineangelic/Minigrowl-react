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
      activeBoard: 2,
      sensors: [],
      actuators: [],
      chartData: [],
      chartSensor: {}, //selected chart
      chartHistData: [],
      chartHistSensor: {}, //selected chart history
      lastESPContact: new Date(),
      actuatorsUptime: [{}],
      actuatorsSchedule: [{}],
      putScheduleErr: '',
    };
  }

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
      return list.concat({ _id: act.actuatorId, count: 0, timeSpan: timespan });
    }
  };
  onUpdateSchedule = (scheduleArr, act) => {
    /* if (scheduleArr && scheduleArr.length > 1) {
      const slint = scheduleArr;
      return slint;
    } else if (scheduleArr && scheduleArr.length > 0) {
      return [].concat(scheduleArr);
    }
    return [];*/

    console.log('RECEIVED SCHEDULE: ' + scheduleArr);
    if (scheduleArr) {
      //togli quello pertinente
      if (scheduleArr.length > 0) {
        const list = this.state.actuatorsSchedule.filter((item, j) => scheduleArr[0].actuatorId !== item.actuatorId);
        //singleUptime.timeSpan = timespan;
        const catted = list.concat(scheduleArr); //rimettilo
        return catted;
      }
      return [];
    }
  };
  onUpdateSensor = (updatedSensor) => {
    const list = this.state.sensors.map((sensor, j) => {
      if (sensor.sensorId === updatedSensor.sensorId) {
        console.log('SENSORI ASYNC RECV' + updatedSensor);
        console.log(updatedSensor);
        return updatedSensor;
      } else {
        return sensor;
      }
    });
    return list;
  };
  onUpdateActuator = (updatedActuator) => {
    const list = this.state.actuators.map((act, j) => {
      if (act.actuatorId === updatedActuator.actuatorId) {
        console.log('ACT ASYNC RECV');
        console.log(updatedActuator);
        return updatedActuator;
      } else {
        return act;
      }
    });
    return list;
  };

  webSock() {
    if (!this.client) this.client = new Client();

    if (!this.state.isWebSocketEnabled) {
      console.log('CLOSED WEBSOCKET');
      this.client.deactivate();
      return;
    }

    this.client.configure({
      brokerURL: `wss://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/minigrowl-ws/websocket`,
      onConnect: () => {
        console.log('WEBSOCKET CONNECTED');
        this.client.subscribe('/topic/sensors', (message) => {
          const sens = message.body;
          const slist = this.onUpdateSensor(JSON.parse(sens));
          ///ieeee aggiorno solo quello ciusto
          this.setState({
            isOnline: true,
            sensors: slist,
          });
        });
        this.client.subscribe('/topic/actuators', (message) => {
          const sens = message.body;
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
    }
  }
  //called from menu
  handleBoardChange(event) {
    console.log('ACTIVE BOARD: ' + event);
    localStorage.setItem('activeBoard', event);
    this.setState(
      {
        activeBoard: event,
        sensors: [],
        actuators: [],
        chartData: [],
        chartSensor: {}, //selected chart
        chartHistData: [],
        chartHistSensor: {},
        lastESPContact: new Date(),
        actuatorsUptime: [{}],
        actuatorsSchedule: [{}],
      },
      () => {
        console.log('ACTIVE BOARD:' + this.state.activeBoard);
        this.askSensors();
        this.askActuators();
        this.webSock();
      },
    );
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
      .get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/sensors/${this.state.activeBoard}`,
      )
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
  }
  askActuators() {
    axios
      .get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/actuators/${this.state.activeBoard}`,
      )
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
  }

  askActuatorUptime(actuat, dtIn, dtOut, timeSpan) {
    axios
      .get(`http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/actuators/uptime/`, {
        params: {
          dataInizio: dtIn,
          dataFine: dtOut,
          actuatorId: actuat.actuatorId,
        },
      })
      .then((response) => {
        const uptimeArr = response.data;
        console.log('Received UPTIME: ');
        console.log(uptimeArr);
        const slist = this.onUpdateUptime(uptimeArr[0], actuat, timeSpan);
        console.log('UPTIMES: ');
        console.log(slist);
        this.setState({
          isOnline: true,
          actuatorsUptime: slist,
        });
      })
      .catch(function (error) {
        //this.setState({ isOnline: false });
        console.log(error);
      });
  }

  askActuatorSchedule(actuator) {
    axios
      .get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/actuators/${actuator.bid.boardId}/${actuator.actuatorId}/schedule`,
      )
      .then((response) => {
        const actSchedule = response.data;
        //console.log('GOT SCHEDULE DATA for actuatorId: ' + actuator.actuatorId);
        const slist = this.onUpdateSchedule(actSchedule, actuator);
        console.log('SCHEDULE: ');
        console.log(slist);
        this.setState({
          isOnline: true,
          actuatorsSchedule: slist,
          putScheduleErr: '',
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  putActuatorSchedule(actuator, dtFrom, dtTo, cmd) {
    console.log('putActuatorSchedule for ' + actuator.id);
    console.log('Schedule command:');
    console.log(cmd);
    const aid = actuator.actuatorId;
    var self = this;
    axios
      .put(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/actuators/${actuator.bid.boardId}/${actuator.actuatorId}/schedule`,
        { aid, dtFrom, dtTo, cmd },
        {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        },
      )
      .then((response) => {
        const actSchedule = response.data;
        console.log('PUT SCHEDULE SUCCESS ' + actSchedule);

        this.askActuatorSchedule(actuator);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response.data.message);
        //console.log(error.response.status);
        //console.log(error.response.headers);
        self.setState({
          putScheduleErr: error.response.data.message,
        });
        return error.response.data;
        //this.setState({ isOnline: false });
      });
  }

  deleteActuatorSchedule(act, sched) {
    console.log('deleteActuatorSchedule command:');
    console.log(sched);
    const aid = sched.actuatorScheduleId;
    axios
      .delete(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/actuators/${act.bid.boardId}/${act.actuatorId}/schedule/${aid}`,
        {
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          headers: { 'Content-Type': 'application/json' },
          data: {},
        },
      )
      .then((response) => {
        const actSchedule = response.data;
        console.log('DELETE SCHEDULE SUCCESS ' + actSchedule);

        this.askActuatorSchedule(act);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.message);
        //this.setState({ isOnline: false });
      });
  }

  askChartData(sensor) {
    axios
      .get(
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/sensors/${sensor.sensorId}/hourChart`,
      )
      .then((response) => {
        const chartDatar = response.data;
        console.log('GOT CHART DATA');
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
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/sensors/${sensor.sensorId}/historyChart`,
      )
      .then((response) => {
        const chartDatar = response.data;
        console.log('GOT HISTORY DATA for sensorID: ' + sensor.sensorId);
        this.setState({ chartHistData: chartDatar, chartHistSensor: sensor, isOnline: true });
      })
      .catch(function (error) {
        console.log(error);
        //this.setState({ isOnline: false });
      });
  }

  componentDidMount() {
    var activeBoard = localStorage.getItem('activeBoard');
    console.log('LOADED activeBoard:' + activeBoard);
    if (activeBoard) this.handleBoardChange(activeBoard);
    else {
      this.askSensors();
      this.askActuators();
      this.webSock();
    }
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
        `http://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/api/minigrowl/v2/commands/${this.state.activeBoard}/queue/add`,
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

        <MinigrowlAppBar
          t={t}
          value={this.state}
          onBoardChange={(bo) => this.handleBoardChange(bo)}
          onToggleWebSocket={() => this.toggleWebSocket()}
        />

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
              formatter={i18n.language === 'it' ? itaFormat : i18n.language === 'en' ? engFormat : ruFormat}
              date={this.getLastContact(this.state)}
            />{' '}
          </Typography>
          <MinigrowlDashboard
            t={t}
            value={this.state}
            onAskChartData={(aboutWhichSensor) => this.askChartData(aboutWhichSensor)}
            onAskLastContact={(sensors) => this.getLastSensorsContact(sensors)}
            onAskActuatorSchedule={(actuator) => this.askActuatorSchedule(actuator)}
            onPutActuatorSchedule={(actuator, dtIn, dtTo, cmd) => this.putActuatorSchedule(actuator, dtIn, dtTo, cmd)}
            onDeleteActuatorSchedule={(act, sched) => this.deleteActuatorSchedule(act, sched)}
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
