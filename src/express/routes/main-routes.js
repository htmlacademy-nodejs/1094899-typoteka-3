'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {convertViewArticles} = require(`../adapters/view-model`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils/error`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  // количество запрашиваемых объявлений равно количеству объявлений на странице
  const limit = ARTICLES_PER_PAGE;

  // количество объявлений, которое нам нужно пропустить - это количество объявлений на предыдущих страницах
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const template = count === 0 ? `main-empty` : `main`;

  res.render(template, {
    articles: convertViewArticles(articles),
    categories,
    page,
    totalPages
  });
});

mainRouter.get(`/register`, (_req, res) => res.render(`sign-up`));

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    name: `${body[`name`]} ${body[`surname`]}`.trim(),
    email: body[`email`],
    password: body[`password`],
    passwordRepeated: body[`repeat-password`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {validationMessages});
  }
});

mainRouter.get(`/login`, (_req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  try {
    let results = null;

    if (query) {
      const articles = await api.search(query);
      results = convertViewArticles(articles);
    }

    res.render(`search`, {
      query,
      results
    });
  } catch (error) {
    res.render(`search`, {
      query,
      results: []
    });
  }
});

module.exports = mainRouter;
