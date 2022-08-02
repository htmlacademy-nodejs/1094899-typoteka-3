'use strict';

const {Router} = require(`express`);
const articleRouter = new Router();

articleRouter.get(`/:id`, (_req, res) => res.send(`/articles/:id`));
articleRouter.get(`/edit/:id`, (_req, res) => res.send(`/articles/edit/:id`));
articleRouter.get(`/add`, (_req, res) => res.send(`/articles/add`));
articleRouter.get(`/category/:id`, (_req, res) => res.send(`/articles/category/:id`));

module.exports = articleRouter;
