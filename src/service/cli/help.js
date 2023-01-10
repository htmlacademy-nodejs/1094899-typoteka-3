'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--help`,
  run() {
    const text = `
    Программа запускает http-сервер и формирует файл с данными для api.

    Гайд:
      server <command>

      Команды:

      --version:            выводит номер версии
      --help:               печатает этот текст
      --fill <count>        добавляет в БД некоторое количество статей
      --filldb <count>      перезаписывает БД и записывает некоторое колиество статей в БД
      --server <port>       запускает сервер на выбранном порту
    `;

    console.log(chalk.gray(text));
  }
};
