'use strict';

const express = require(`express`);
const request = require(`supertest`);

const articleRouter = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const {HTTP_CODE} = require(`../../constants`);

const mockData = [
  {
    "id": `hzPH6Z`,
    "title": `Учим HTML и CSS`,
    "createdDate": `2022-05-27 04:15:26`,
    "announce": `Первая большая ёлка была установлена только в 1938 году.`,
    "fullText": `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
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
    "fullText": `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Простые ежедневные упражнения помогут достичь успеха.`,
    "category": [
      `Музыка`,
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
    "title": `Что такое осень`,
    "createdDate": `2022-07-13 22:32:04`,
    "announce": `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    "fullText": `Рок-музыка всегда ассоциировалась с протестами.`,
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

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articleRouter(app, new ArticleService(cloneData.slice(0)), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Returns a list of 3 articles`, () => expect(response.body.length).toBe(3));
  test(`First article's id equals "hzPH6Z"`, () => expect(response.body[0].id).toBe(`hzPH6Z`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/hzPH6Z`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Article's title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));

});

describe(`API creates an article if data is valid`, () => {
  const newArticle = {
    title: `Золотое сечение`,
    createdDate: new Date(1999, 1, 1).toString(),
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `Разное`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HTTP_CODE.created));
  test(`Returns created article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );

});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `Золотое сечение`,
    createdDate: new Date(1999, 1, 1).toString(),
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `Разное`,
  };

  let app;

  beforeAll(() => {
    app = createAPI();
  });

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
        .post(`/articles`)
        .send(badArticle)
        .expect(HTTP_CODE.clientError);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `Золотое сечение`,
    createdDate: new Date(1999, 1, 1).toString(),
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `Разное`,
  };

  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app)
      .put(`/articles/hzPH6Z`)
      .send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () => request(app)
    .get(`/articles/hzPH6Z`)
    .expect((res) => expect(res.body.title).toBe(`Золотое сечение`))
  );

});

test(`API returns status code 404 when trying to change non-existent article`, () => {

  const app = createAPI();

  const newArticle = {
    title: `Золотое сечение`,
    createdDate: new Date(1999, 1, 1).toString(),
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `Разное`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(newArticle)
    .expect(HTTP_CODE.notFound);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {

  const app = createAPI();

  const newInvalidArticle = {
    announce: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    category: `Разное`,
  };

  return request(app)
    .put(`/articles/NOEXST`)
    .send(newInvalidArticle)
    .expect(HTTP_CODE.clientError);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app)
      .delete(`/articles/hzPH6Z`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`hzPH6Z`));
  test(`Article count is 2 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(2))
  );

});

test(`API refuses to delete non-existent article`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST`)
    .expect(HTTP_CODE.notFound);

});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/hzPH6Z/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));
  test(`First comment's id is "dz4qEt"`, () => expect(response.body[0].id).toBe(`dz4qEt`));
});


describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/hzPH6Z/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HTTP_CODE.created));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/hzPH6Z/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );

});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `Неважно`
    })
    .expect(HTTP_CODE.notFound);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app)
    .post(`/articles/hzPH6Z/comments`)
    .send({})
    .expect(HTTP_CODE.clientError);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/hzPH6Z/comments/dz4qEt`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HTTP_CODE.ok));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`dz4qEt`));
  test(`Comments count is 1 now`, () => request(app)
    .get(`/articles/hzPH6Z/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent comment`, () => {

  const app = createAPI();

  return request(app)
    .delete(`/articles/hzPH6Z/comments/NOEXST`)
    .expect(HTTP_CODE.notFound);

});

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/dz4qEt`)
    .expect(HTTP_CODE.notFound);
});
