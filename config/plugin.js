'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  }
};
