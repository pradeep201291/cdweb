/***
 * @author: Tavant technologies
 * The configuration loader will check the environment and load the configuration appropriately.
 */

import { AppSettings, AppVersion } from './settings';

let appConfig: AppSettings;
let version: AppVersion;

appConfig = require('./app-config');
version = require('./version');

appConfig.version = version.appVersion;

export const StearnsAppConfig: AppSettings = appConfig;
