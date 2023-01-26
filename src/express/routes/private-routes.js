'use strict';

const {Router} = require(`express`);
const privateRouter = new Router();
const api = require(`../api`).getAPI();
const {convertViewArticles} = require(`../adapters/view-model`);
const auth = require(`../middlewares/auth`);

privateRouter.get(`/`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  res.render(`my-posts`, {
    articles: convertViewArticles(articles),
    user,
  });
});

privateRouter.get(`/categories`, auth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories(true);
  res.render(`all-categories`, {
    categories,
    user,
  });
});

privateRouter.get(`/comments`, auth, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({comments: true});
  res.render(`comments`, {
    articles: convertViewArticles(articles),
    user,
  });
});

module.exports = privateRouter;
