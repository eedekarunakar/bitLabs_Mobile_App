/**
 * @format
 */

import {AppRegistry,Text,TextInput} from 'react-native';
import App from './App';
import New from './New';

import {name as appName} from './app.json';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.style = { fontFamily: 'Plus Jukarta Sans'};

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
TextInput.defaultProps.style = { fontFamily: 'Plus Jukarta Sans', fontSize: 13.3 };

AppRegistry.registerComponent(appName, () => New);
