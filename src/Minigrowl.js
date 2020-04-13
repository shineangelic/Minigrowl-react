import React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import MinigrowlDashboard from './MinigrowlDashboard';
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
  askSensors() {
    //sensors = [];
    axios
      .get('http://192.168.0.54:8080/api/minigrowl/v1/sensors')
      .then((response) => {
        const sensors = response.data;
        console.log(sensors);
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
  componentDidMount() {
    this.askSensors();
    this.askActuators();
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
        <MinigrowlDashboard value={this.state} onClick={(com) => this.sendCommand(com)} />
      </div>
    );
  }
}
export default Minigrowl;
