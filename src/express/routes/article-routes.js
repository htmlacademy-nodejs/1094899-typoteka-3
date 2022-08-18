'use strict';

const {Router} = require(`express`);
const articleRouter = new Router();
const api = require(`../api`).getAPI();

articleRouter.get(`/:id`, (_req, res) => res.render(`post-detail`));
articleRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`post`, {article, categories});
});
articleRouter.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();

  res.render(`post`, {categories});
});

articleRouter.get(`/category/:id`, (_req, res) => res.render(`articles-by-category`));

module.exports = articleRouter;
