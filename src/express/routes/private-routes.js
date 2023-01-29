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

privateRouter.post(`/comments/delete`, auth, async (req, res) => {
  const {id, articleId} = req.body;
  try {
    await api.deleteComment({commentId: id, articleId});
    res.redirect(`/my/comments`);
  } catch (e) {
    res.render(`500`);
  }
});

privateRouter.post(`/categories/delete`, auth, async (req, res) => {
  const {id} = req.body;
  try {
    await api.deleteCategory(id);
    res.redirect(`/my/categories`);
  } catch (e) {
    res.render(`500`);
  }
});

privateRouter.post(`/categories/add`, auth, async (req, res) => {
  const {name} = req.body;
  try {
    await api.createCategory({name});
    res.redirect(`/my/categories`);
  } catch (e) {
    res.render(`500`);
  }
});

privateRouter.post(`/categories/edit`, auth, async (req, res) => {
  const {id, name} = req.body;
  try {
    await api.editCategory(id, {name});
    res.redirect(`/my/categories`);
  } catch (e) {
    res.render(`500`);
  }
});

module.exports = privateRouter;
