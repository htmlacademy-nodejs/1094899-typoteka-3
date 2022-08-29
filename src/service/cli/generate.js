'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);
const {ExitCode, Encoding} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils/common`);
const {pickRandomDate, humanizeDate} = require(`../../utils/date`);

const DEFAULT_COUNT = 1;
const TOTAL_MOCK_LIMIT = 1000;
const PUBLISH_LIMIT_DAY = -90; // 3 месяца назад
const MAX_ANNOUNCE_COUNT = 5;
const MAX_ID_LENGTH = 6;
const MAX_COMMENTS = 4;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, Encoding.utf8);
    const collection = content.trim().split(`\n`);
    return collection;
  } catch (err) {
    console.error(chalk.red(`Can't open source file: ${err}`));
    throw err;
  }
};

const generateComments = (count, comments) => (
  Array.from({length: count}, () => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)[getRandomInt(0, comments.length - 1)],
    author: `John ${nanoid(MAX_ID_LENGTH)}`,
    createdDate: humanizeDate(pickRandomDate(PUBLISH_LIMIT_DAY)),
  }))
);

const generateArticles = (count, titles, categories, announces, comments) => (
  Array.from({length: count}, () => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: humanizeDate(pickRandomDate(PUBLISH_LIMIT_DAY)),
    announce: shuffle(announces).slice(1, getRandomInt(1, MAX_ANNOUNCE_COUNT)).join(` `),
    fullText: shuffle(announces).slice(1, getRandomInt(1, announces.length - 1)).join(` `),
    category: shuffle(categories).slice(1, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > TOTAL_MOCK_LIMIT) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    try {
      const [titles, categories, sentences, comments] = await Promise.all([
        readContent(FILE_TITLES_PATH),
        readContent(FILE_CATEGORIES_PATH),
        readContent(FILE_SENTENCES_PATH),
        readContent(FILE_COMMENTS_PATH),
      ]);

      const content = JSON.stringify(generateArticles(countArticle, titles, categories, sentences, comments));
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file: ${err}`));
      process.exit(ExitCode.error);
    }
  }
};
