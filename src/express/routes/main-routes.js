'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {convertViewArticles, convertViewTopText} = require(`../adapters/view-model`);
const {ARTICLES_PER_PAGE, TOP_ARTICLES, TOP_COMMENTS, TOP_LIMIT_TEXT} = require(`../../constants`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils/error`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;

  // количество запрашиваемых объявлений равно количеству объявлений на странице
  const limit = ARTICLES_PER_PAGE;

  // количество объявлений, которое нам нужно пропустить - это количество объявлений на предыдущих страницах
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [
    {count, articles},
    categories,
    topArticles,
    topComments,
  ] = await Promise.all([
    api.getArticles({limit, offset, comments: true}),
    api.getCategories(true),
    api.getTopArticles(TOP_ARTICLES),
    api.getTopComments(TOP_COMMENTS),
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);
  const template = count === 0 ? `main-empty` : `main`;

  res.render(template, {
    articles: convertViewArticles(articles),
    categories,
    page,
    totalPages,
    user,
    topArticles: convertViewTopText(topArticles, TOP_LIMIT_TEXT),
    topComments: convertViewTopText(topComments, TOP_LIMIT_TEXT),
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

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const {user} = req.session;
    res.render(`login`, {user, validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  req.session.destroy(() => res.redirect(`/`));
});

mainRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;
  try {
    let results = null;

    if (query) {
      const articles = await api.search(query);
      results = convertViewArticles(articles);
    }

    res.render(`search`, {
      query,
      results,
      user,
    });
  } catch (error) {
    res.render(`search`, {
      query,
      results: [],
      user,
    });
  }
});

module.exports = mainRouter;
