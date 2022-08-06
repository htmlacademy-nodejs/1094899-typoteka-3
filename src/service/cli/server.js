'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const express = require(`express`);
const {HTTP_CODE, Encoding} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_PATH = `./mocks.json`;

let app = null;

const startServer = (port) => {
  app = express();

  app.use(express.json());

  app.get(`/articles`, async (_req, res) => {
    try {
      const fileContent = await fs.readFile(FILE_PATH, Encoding.utf8);
      const mocks = JSON.parse(fileContent);
      res.json(mocks);
    } catch (err) {
      console.error(chalk.red(`Ошибка: ${err}`));
      res.send([]);
    }
  });

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
