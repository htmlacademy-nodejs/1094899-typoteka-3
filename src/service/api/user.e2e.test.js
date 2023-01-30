'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const userRouter = require(`./user`);
const UserService = require(`../data-service/user`);

const {HttpCode} = require(`../../constants`);

const categoriesMock = [
  `Музыка`,
  `IT`,
  `Деревья`,
  `За жизнь`,
  `Разное`,
  `Железо`
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
    "createdAt": `2022-05-27T04:15:26Z`,
    "announce": `Первая большая ёлка была установлена только в 1938 году.`,
    "text": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "categories": [
      `Железо`
    ],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
        "user": `ivanov@example.com`,
      },
      {
        "text": `Плюсую, но слишком много буквы!`,
        "user": `ivanov@example.com`,
      }
    ],
    "user": `ivanov@example.com`,
  },
  {
    "title": `Как перестать беспокоиться и начать жить`,
    "createdAt": `2022-06-14T03:34:29Z`,
    "announce": `Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов.`,
    "text": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха.`,
    "categories": [
      `Музыка`,
      `IT`
    ],
    "comments": [
      {
        "text": `Совсем немного...`,
        "user": `ivanov@example.com`,
      },
    ],
    "user": `ivanov@example.com`,
  },
  {
    "title": `Что такое осень`,
    "createdAt": `2022-07-13T22:32:04Z`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "text": `Рок-музыка всегда ассоциировалась с протестами.`,
    "categories": [
      `Деревья`,
      `За жизнь`,
      `Разное`,
      `Музыка`
    ],
    "comments": [
      {
        "text": `Хочу такую же футболку :-)`,
        "user": `ivanov@example.com`,
      }
    ],
    "user": `ivanov@example.com`,
  },
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: categoriesMock, articles: articlesMock, users: mockUsers});

  const app = express();
  app.use(express.json());
  userRouter(app, new UserService(mockDB));
  return app;
};

describe(`API creates user if data is valid`, () => {
  const validUserData = {
    name: `Сидор Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
    avatar: `sidorov.jpg`
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send(validUserData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.SUCCESS_SILENT));
});
