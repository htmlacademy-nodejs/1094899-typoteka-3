'use strict';

const chalk = require(`chalk`);
const express = require(`express`);
const routes = require(`../api`);
const {HTTP_CODE, API_PREFIX} = require(`../../constants`);

const DEFAULT_PORT = 3000;

let app = null;

const startServer = (port) => {
  app = express();

  app.use(express.json());

  app.use(API_PREFIX, routes);

  app.use((req, res) => {
    console.error(chalk.red(`Ошибка 404: ${req.method} ${req.originalUrl}`));
    res
      .status(HTTP_CODE.notFound)
      .send(`Not found`);
  });

  app.listen(
      DEFAULT_PORT,
      () => console.info(chalk.blue(`Принимаю подключения на ${port}`))
  );
};

module.exports = {
  name: `--server`,
  run(args) {
    const [askedPort] = args;
    const port = Number.parseInt(askedPort, 10) || DEFAULT_PORT;
    startServer(port);
  }
};
