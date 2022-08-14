'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HTTP_CODE} = require(`../../constants`);

const mockData = [
  {
    "id": `hzPH6Z`,
    "title": `Учим HTML и CSS`,
    "createdDate": `2022-05-27 04:15:26`,
    "announce": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    "fullText": `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "category": [
      `Железо`
    ],
    "comments": [
      {
        "id": `dz4qEt`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        "id": `nR_Vg5`,
        "text": `Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "id": `WpLwkM`,
    "title": `Как перестать беспокоиться и начать жить`,
    "createdDate": `2022-06-14 03:34:29`,
    "announce": `Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов. Это один из лучших рок-музыкантов.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Первая большая ёлка была установлена только в 1938 году. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Как начать действовать? Для начала просто соберитесь.`,
    "category": [
      `Музыка`,
      `Программирование`,
      `Железо`,
      `За жизнь`,
      `Деревья`,
      `Разное`,
      `IT`
    ],
    "comments": [
      {
        "id": `RQxidd`,
        "text": `Совсем немного...`
      },
    ]
  },
  {
    "id": `ABe9Y6`,
    "title": `Что такое золотое сечение`,
    "createdDate": `2022-07-13 22:32:04`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "fullText": `Золотое сечение — соотношение двух величин, гармоническая пропорция. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году.`,
    "category": [
      `Деревья`,
      `За жизнь`,
      `Разное`,
      `Музыка`
    ],
    "comments": [
      {
        "id": `PhZMXZ`,
        "text": `Хочу такую же футболку :-)`
      }
    ]
  },
];

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `золотое сечение`
      });
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`1 article found`, () => expect(response.body.length).toBe(1));
  test(`Article has correct id`, () => expect(response.body[0].id).toBe(`ABe9Y6`));
});

test(`API returns 400 when query string is absent`,
    () => request(app)
      .get(`/search`)
      .expect(HTTP_CODE.clientError)
);

test(`API returns code 404 if nothing is found`,
    () => request(app)
      .get(`/search`)
      .query({
        query: `несуществующее обьявление`
      })
      .expect(HTTP_CODE.notFound)
);