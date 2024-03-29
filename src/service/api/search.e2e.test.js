'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const searchRoute = require(`./search`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const categoriesMock = [
  `Музыка`,
  `Программирование`,
  `Железо`,
  `За жизнь`,
  `Деревья`,
  `Разное`,
  `IT`
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const articlesMock = [
  {
    "title": `Учим HTML и CSS`,
    "createdAt": `2023-01-09T11:16:26.839Z`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "text": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [
      `Железо`
    ],
    "comments": [],
    "user": `ivanov@example.com`,
  },
  {
    "title": `Как перестать беспокоиться и начать жить`,
    "createdAt": `2023-01-09T11:16:26.839Z`,
    "announce": `Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов.`,
    "text": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь.`,
    "categories": [
      `Музыка`,
      `Программирование`,
      `Железо`,
      `За жизнь`,
      `Деревья`,
      `Разное`,
      `IT`
    ],
    "comments": [],
    "user": `ivanov@example.com`,
  },
  {
    "title": `Что такое золотое сечение`,
    "createdAt": `2023-01-09T11:16:26.839Z`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "text": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году.`,
    "categories": [
      `Деревья`,
      `За жизнь`,
      `Разное`,
      `Музыка`
    ],
    "comments": [],
    "user": `ivanov@example.com`,
  },
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: categoriesMock, articles: articlesMock, users: mockUsers});
  searchRoute(app, new DataService(mockDB));
});

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `чим`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct title`, () => expect(response.body[0].title).toBe(`Учим HTML и CSS`));
});

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HttpCode.CLIENT_ERROR)
);

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `несуществующее обьявление`
      })
      .expect(HttpCode.NOT_FOUND)
);
