'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {ExitCode, Encoding} = require(`../../constants`);
const {
  getRandomInt,
  shuffle,
  pickRandomDate,
  humanizeDate,
} = require(`../../utils/common`);

const DEFAULT_COUNT = 1;
const TOTAL_MOCK_LIMIT = 1000;
const PUBLISH_LIMIT_DAY = -90; // 3 месяца назад
const MAX_ANNOUNCE_COUNT = 5;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

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

const generateArticles = (count, titles, categories, announces) => (
  Array.from({length: count}, () => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: humanizeDate(pickRandomDate(PUBLISH_LIMIT_DAY)),
    announce: shuffle(announces).slice(1, getRandomInt(1, MAX_ANNOUNCE_COUNT)).join(` `),
    fullText: shuffle(announces).slice(1, getRandomInt(1, announces.length - 1)).join(` `),
    category: shuffle(categories).slice(1, getRandomInt(1, categories.length - 1)),
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
      const collections = await Promise.all([
        await readContent(FILE_TITLES_PATH),
        await readContent(FILE_CATEGORIES_PATH),
        await readContent(FILE_SENTENCES_PATH),
      ]);

      const content = JSON.stringify(generateArticles(countArticle, collections[0], collections[1], collections[2]));
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
