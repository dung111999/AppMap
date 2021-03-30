/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import MainPage from './src/component/MainPage';
import List from './src/component/List';
import {Router} from './src/Router';
 import Test from './src/Test';


console.disableYellowBox = true;

AppRegistry.registerComponent(appName, () => Test);

// AppRegistry.registerComponent(appName, () => Test);