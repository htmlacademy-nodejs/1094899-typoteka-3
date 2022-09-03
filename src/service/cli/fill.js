'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {ExitCode, Encoding} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils/common`);

const DEFAULT_COUNT = 1;
const TOTAL_MOCK_LIMIT = 1000;
const MAX_ANNOUNCE_COUNT = 5;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
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

const generateComments = (count, articleId, userCount, comments) => (
  Array.from({length: count}, () => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)[getRandomInt(0, comments.length - 1)],
  }))
);

const generateArticleCategories = (count, articleId) => (
  Array.from({length: count}, (_, index) => ({
    articleId,
    categoryId: index + 1,
  }))
);

const getPictureFileName = (number) => `aricle${number.toString().padStart(2, 0)}.jpg`;

const generateArticles = (count, titles, categoryCount, userCount, announces, comments) => (
  Array.from({length: count}, (_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(announces).slice(1, getRandomInt(1, MAX_ANNOUNCE_COUNT)).join(` `),
    fullText: shuffle(announces).slice(1, getRandomInt(1, announces.length - 1)).join(` `),
    category: generateArticleCategories(getRandomInt(1, categoryCount), index + 1, categoryCount),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    userId: getRandomInt(1, userCount),
    image: getRandomInt(1, 10) > 5 ? getPictureFileName(index + 1) : null
  }))
);

const generateContent = (users, titles, categories, sentences, commentSentences, countArticle) => {
  const articles = generateArticles(countArticle, titles, categories.length, users.length, sentences, commentSentences);

  const comments = articles.flatMap((article) => article.comments);
  const articleCategories = articles.flatMap((article) => article.category);

  const userValues = users.map(
      ({email, passwordHash, firstName, lastName, isAdmin}) =>
        `('${email}', '${passwordHash}', '${firstName}', '${lastName}', ${isAdmin})`
  ).join(`,\n`);

  const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

  const articleValues = articles.map(
      ({title, announce, fullText, image, userId}) =>
        `('${title}', '${announce}', '${fullText}', '${image}', ${userId})`
  ).join(`,\n`);

  const articleCategoryValues = articleCategories.map(
      ({articleId, categoryId}) =>
        `(${articleId}, ${categoryId})`
  ).join(`,\n`);

  const commentValues = comments.map(
      ({text, userId, articleId}) =>
        `('${text}', ${userId}, ${articleId})`
  ).join(`,\n`);

  return `
INSERT INTO users(email, password_hash, first_name, last_name, is_admin) VALUES
${userValues};
INSERT INTO categories(name) VALUES
${categoryValues};
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, "text", image, user_id) VALUES
${articleValues};
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE article_categories DISABLE TRIGGER ALL;
INSERT INTO article_categories(article_id, category_id) VALUES
${articleCategoryValues};
ALTER TABLE article_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, user_id, article_id) VALUES
${commentValues};
ALTER TABLE comments ENABLE TRIGGER ALL;
  `;
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countArticle > TOTAL_MOCK_LIMIT) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }

    const users = [
      {
        email: `ivanov1@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        isAdmin: true
      },
      {
        email: `petrov1@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        isAdmin: false
      }
    ];

    try {
      const [titles, categories, sentences, comments] = await Promise.all([
        readContent(FILE_TITLES_PATH),
        readContent(FILE_CATEGORIES_PATH),
        readContent(FILE_SENTENCES_PATH),
        readContent(FILE_COMMENTS_PATH),
      ]);

      const content = generateContent(users, titles, categories, sentences, comments, countArticle);

      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file: ${err}`));
      process.exit(ExitCode.error);
    }
  }
};
