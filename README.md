This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify




# Minigrowl-react
front-end for growl app

Minigrow APIs are based on three kind of objects: sensors, actuators and commands. While the first tho reflec real hardware devices with their own reading, the command is an abstraction used to drive such devices.

# APIs
```
   /api/minigrowl/v1/commands
   /api/minigrowl/v1/sensors
   /api/minigrowl/v1/actuators
   /api/minigrowl/v1/commands/queue/add
```



## Command example:
```
[
    {
        "name": "Turn ON intake Fan",
        "val": "1",
        "tgt": 2
    },
    {
        "name": "Turn intake Fan OFF",
        "val": "0",
        "tgt": 2
    },
    {
        "name": "Set Temperature",
        "val": "2",
        "tgt": 25
    },
    {
        "name": "Turn ON Hvac",
        "val": "1",
        "tgt": 25
    },
    {
        "name": "Turn OFF Hvac",
        "val": "0",
        "tgt": 25
    },
    {
        "name": "Switch lights ON",
        "val": "1",
        "tgt": 12
    },
    {
        "name": "Switch lights OFF",
        "val": "0",
        "tgt": 12
    },
    {
        "name": "Turn ON outtake Fan",
        "val": "1",
        "tgt": 13
    },
    {
        "name": "Turn OFF outtake Fan",
        "val": "0",
        "tgt": 13
    }
]
```

## Sensors example:
```
[
    {
        "id": 17,
        "typ": "HUMIDITY",
        "val": "25.57002",
        "uinit": "PERCENT",
        "timeStamp": "2020-04-11T13:22:34.205+0000",
        "err": false
    },
    {
        "id": 21,
        "typ": "BAROMETER",
        "val": "1012.763",
        "uinit": "MILLIBAR",
        "timeStamp": "2020-04-11T13:22:20.353+0000",
        "err": false
    },
    {
        "id": 22,
        "typ": "TEMPERATURE",
        "val": "26.12",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:22:48.155+0000",
        "err": false
    },
    {
        "id": 33,
        "typ": "LIGHT",
        "val": "673",
        "uinit": "LUMEN",
        "timeStamp": "2020-04-11T13:23:02.023+0000",
        "err": false
    }
]
```

## Actuators example (w/ supported commands)
```
[
    {
        "id": 2,
        "typ": "FAN",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:26:25.983+0000",
        "val": "1",
        "err": false,
        "cmds": [
            {
                "name": "Turn ON intake Fan",
                "val": "1",
                "tgt": 2
            },
            {
                "name": "Turn intake Fan OFF",
                "val": "0",
                "tgt": 2
            }
        ]
    },
    {
        "id": 12,
        "typ": "LIGHT",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:25:58.109+0000",
        "val": "1",
        "err": false,
        "cmds": [
            {
                "name": "Switch lights ON",
                "val": "1",
                "tgt": 12
            },
            {
                "name": "Switch lights OFF",
                "val": "0",
                "tgt": 12
            }
        ]
    },
    {
        "id": 13,
        "typ": "FAN",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:26:11.987+0000",
        "val": "0",
        "err": false,
        "cmds": [
            {
                "name": "Turn ON outtake Fan",
                "val": "1",
                "tgt": 13
            },
            {
                "name": "Turn OFF outtake Fan",
                "val": "0",
                "tgt": 13
            }
        ]
    },
    {
        "id": 25,
        "typ": "HVAC",
        "uinit": "CELSIUS",
        "timeStamp": "2020-04-11T13:26:21.342+0000",
        "val": "1",
        "err": false,
        "cmds": [
            {
                "name": "Set Temperature",
                "val": "2",
                "tgt": 25
            },
            {
                "name": "Turn ON Hvac",
                "val": "1",
                "tgt": 25
            },
            {
                "name": "Turn OFF Hvac",
                "val": "0",
                "tgt": 25
            }
        ]
    }
]
```
## Send Command example
PUT on /api/minigrowl/v1/commands/queue/add, with payload like the following (it must be a supported command seen above)
```
{
        "name": "Turn intake Fan OFF",
        "targetActuator": 2,
        "val": "0"
}
```

