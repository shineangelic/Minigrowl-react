# Minigrowl-react

This is the web client for minigrowl, a project to drive a generic **growroom**. Tomatoes? Baikal Express? You decide. In any case I decline accountability on how you'll decide to use/modify this software, growing _some kind_ of herbs is not that legal in some countries.

Minigrow APIs are based on three kind of JSON objects: `sensors`, `actuators` and `commands`. While the first two reflect real hardware devices with their own reading/status, the command is an abstraction used to drive such devices. Please see [Microgrowl-spring](https://shineangelic.github.io/Minigrowl-spring/) for general concepts and [Microgrowl-ESP32](https://shineangelic.github.io/Minigrowl-ESP-LoRa32-OLED/) for harware explanation and embedded lifecycle behaviour.

![screenshot](/docs/scrrenDesktop1.png)

Thanks to [@hatemalimam](https://github.com/hatemalimam) for bootstrapping and contributing, I am a react novice, so please take this project as it comes. Enabling web-sockets was really satisfactory, please point out any possible improvement creating an issue.

![screenshot](/docs/scrrenDesktop2.png)

This app can control real devices over JSON, show sensors readings and plot charts with data taken from [Microgrowl-spring](https://shineangelic.github.io/Minigrowl-spring/) MongoDB's module. Remember you can't control an `Actuator` unless it's set to `Manual` mode.

![charts screenshot](/docs/charts.png)

### Known issues

- unfinished i18n
- charts can't be deleted/reset

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
