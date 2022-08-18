'use strict';

const express = require(`express`);
const {getApiRouter} = require(`../api`);
const {getLogger} = require(`../lib/logger`);
const {HTTP_CODE, API_PREFIX} = require(`../../constants`);

const DEFAULT_PORT = 3000;

let app = null;

const startServer = async (port) => {
  const logger = getLogger({name: `api`});
  app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });

  const routes = await getApiRouter();
  app.use(API_PREFIX, routes);

  app.use((req, res) => {
    logger.error(`Ошибка 404: ${req.method} ${req.originalUrl}`);
    res
      .status(HTTP_CODE.notFound)
      .send(`Not found`);
  });

  app.use((err, _req, _res, _next) => {
    logger.error(`An error occured on processing request: ${err.message}`);
  });

  try {
    app.listen(port, (err) => {
      if (err) {
        return logger.error(`An error occured on server creation: ${err.message}`);
      }

      return logger.info(`Принимаю подключения на ${port}`);
    });

  } catch (err) {
    logger.error(`An error occured: ${err.message}`);
    process.exit(1);
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [askedPort] = args;
    const port = Number.parseInt(askedPort, 10) || DEFAULT_PORT;
    await startServer(port);
  }
};
