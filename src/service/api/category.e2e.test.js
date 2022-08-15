'use strict';

const express = require(`express`);
const request = require(`supertest`);

const categoryRoute = require(`./category`);
const DataService = require(`../data-service/category`);
const {HTTP_CODE} = require(`../../constants`);

const mockData = [
  {
    "id": `hzPH6Z`,
    "title": `Учим HTML и CSS`,
    "createdDate": `2022-05-27 04:15:26`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "category": [
      `Железо`,
      `Разное`,
    ],
    "comments": []
  },
  {
    "id": `ABe9Y6`,
    "title": `Что такое золотое сечение`,
    "createdDate": `2022-07-13 22:32:04`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году.`,
    "category": [
      `Железо`,
      `За жизнь`,
      `Музыка`
    ],
    "comments": []
  },
];

const app = express();
app.use(express.json());
categoryRoute(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/category`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Returns list of categories`, () => expect(response.body.length).toBe(4));

  test(`Category names are "Железо", "За жизнь", "Разное", "Музыка"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Железо`, `За жизнь`, `Разное`, `Музыка`])
      )
  );
});
