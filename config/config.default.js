/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1576142606366_7379';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  const mongoose = {
    url: 'mongodb://127.0.0.1:27017/xxxbz',
    options: {
      useUnifiedTopology: true,
    },
    // mongoose global plugins, expected a function or an array of function and options
  };
  const security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    // domainWhiteList: '*'
  };
  const cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };
  return {
    ...config,
    ...userConfig,
    mongoose,
    security,
    cors
  };
};
