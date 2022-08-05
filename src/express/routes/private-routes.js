'use strict';

const {Router} = require(`express`);
const privateRouter = new Router();

privateRouter.get(`/`, (_req, res) => res.render(`my`));
privateRouter.get(`/categories`, (_req, res) => res.render(`all-categories`));
privateRouter.get(`/comments`, (_req, res) => res.render(`comments`));

module.exports = privateRouter;
