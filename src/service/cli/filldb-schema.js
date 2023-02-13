'use strict';

const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const {getLogger} = require(`../lib/logger`);
const {ExitCode} = require(`../../constants`);
const logger = getLogger({});

module.exports = {
  name: `--filldb-schema`,
  async run() {
    try {
      logger.info(`Trying to create schema...`);
      const sequelize = getSequelize();
      defineModels(sequelize);
      await sequelize.sync({force: true});
      logger.info(`Schema is ready!`);
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }
  }
};
