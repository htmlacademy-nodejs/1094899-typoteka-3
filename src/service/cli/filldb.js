'use strict';

const fs = require(`fs`).promises;
const {ExitCode, Encoding} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils/common`);
const {getLogger} = require(`../lib/logger`);
const passwordUtils = require(`../lib/password`);
const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);

const DEFAULT_COUNT = 1;
const TOTAL_MOCK_LIMIT = 1000;
const MAX_ANNOUNCE_COUNT = 5;
const MAX_COMMENTS = 4;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, Encoding.utf8);
    const collection = content.trim().split(`\n`);
    return collection;
  } catch (err) {
    logger.error(`Error when reading file: ${err.message}`);
    return [];
  }
};

const generateComments = (count, comments, users) => (
  Array.from({length: count}, () => ({
    text: shuffle(comments)[getRandomInt(0, comments.length - 1)],
    user: users[getRandomInt(0, users.length - 1)].email,
  }))
);

const generateArticles = (count, titles, categories, announces, comments, users) => (
  Array.from({length: count}, () => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(announces).slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT)).join(` `),
    text: shuffle(announces).slice(0, getRandomInt(1, announces.length - 1)).join(` `),
    categories: shuffle(categories).slice(1, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
    user: users[getRandomInt(0, users.length - 1)].email,
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > TOTAL_MOCK_LIMIT) {
      logger.error(`Не больше ${TOTAL_MOCK_LIMIT} публикаций`);
      process.exit(ExitCode.ERROR);
    }

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }

    logger.info(`Connection to database established`);

    const [titles, categories, sentences, comments] = await Promise.all([
      readContent(FILE_TITLES_PATH),
      readContent(FILE_CATEGORIES_PATH),
      readContent(FILE_SENTENCES_PATH),
      readContent(FILE_COMMENTS_PATH),
    ]);

    const users = [
      {
        name: `Иван Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`,
        isAdmin: true,
      },
      {
        name: `Пётр Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar-2.png`,
        isAdmin: false,
      }
    ];

    const articles = generateArticles(countArticle, titles, categories, sentences, comments, users);
    logger.info(`Prepare mock articles: ${articles.count}.`);

    return initDatabase(sequelize, {categories, articles, users});
  }
};
