'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const categoryRoute = require(`./category`);
const DataService = require(`../data-service/category`);
const {HTTP_CODE} = require(`../../constants`);

const categoriesMock = [
  `Железо`,
  `За жизнь`,
  `Музыка`,
  `Разное`
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
      `Железо`,
      `Разное`,
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
      `Железо`,
      `За жизнь`,
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
  categoryRoute(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Returns list of categories`, () => expect(response.body.length).toBe(4));

  test(`Category names are "Железо", "За жизнь", "Разное", "Музыка"`,
      () => expect(response.body.map((x)=>x.name)).toEqual(
          expect.arrayContaining([`Железо`, `За жизнь`, `Разное`, `Музыка`])
      )
  );
});
