'use strict';

const pino = require(`pino`);

const LOG_FILE = `./logs/api.log`;
const {Env} = require(`../../constants`);

const PROCESS_STDOUT_ID = 1;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  transport: {
    target: `pino-pretty`,
    options: {
      destination: isDevMode ? PROCESS_STDOUT_ID : LOG_FILE
    }
  },
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
