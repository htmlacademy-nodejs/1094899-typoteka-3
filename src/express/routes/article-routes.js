'use strict';

const {Router} = require(`express`);
const articleRouter = new Router();

articleRouter.get(`/:id`, (_req, res) => res.render(`post-detail`));
articleRouter.get(`/edit/:id`, (_req, res) => res.render(`post`));
articleRouter.get(`/add`, (_req, res) => res.render(`post`));
articleRouter.get(`/category/:id`, (_req, res) => res.render(`articles-by-category`));

module.exports = articleRouter;
