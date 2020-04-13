import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import MinigrowlDashboard from './MinigrowlDashboard';
import { Client } from '@stomp/stompjs';
import './Minigrowl.css';

class Minigrowl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      actuators: [],
      xIsNext: true,
    };
  }
  webSock() {
    console.log('Component did mount');
    // The compat mode syntax is totally different, converting to v5 syntax
    // Client is imported from '@stomp/stompjs'
    this.client = new Client();

    this.client.configure({
      brokerURL: 'ws://192.168.0.54:8080/minigrowl-ws/websocket',
      onConnect: () => {
        console.log('onConnect');

        this.client.subscribe('/topic/sensors', (message) => {
          const sens = message.body;
          console.log('SENSORI ASYNC RECV' + sens);
          const sensors = JSON.parse(sens);
          this.setState({ sensors });
          //OK, ORA ?
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
      .get('http://192.168.0.54:8080/api/minigrowl/v1/sensors')
      .then((response) => {
        const sensors = response.data;
        console.log('AAB' + sensors);
        this.setState({ sensors });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  askActuators() {
    //sensors = [];
    axios
      .get('http://192.168.0.54:8080/api/minigrowl/v1/actuators')
      .then((response) => {
        const actuators = response.data;
        console.log(actuators);
        this.setState({ actuators });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  componentWillMount() {}
  componentDidMount() {
    this.askSensors();
    this.askActuators();
    this.webSock();
  }
  sendCommand(command) {
    console.log('Sending command:');
    console.log(command);
    axios
      .put('http://192.168.0.54:8080/api/minigrowl/v1/commands/queue/add', command, {
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
      <div className="App">
        <header className="App-header">
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Gestione <code>Minigrowl</code>
          </p>
          <a
            className="App-link"
            href="https://github.com/shineangelic/Minigrowl-spring"
            target="_blank"
            rel="noopener noreferrer"
          >
            Minigrowl: Opensource growroom controller
          </a>
        </header>
        <MinigrowlDashboard value={this.state} onCommand={(com) => this.sendCommand(com)} />
      </div>
    );
  }
}
export default Minigrowl;
