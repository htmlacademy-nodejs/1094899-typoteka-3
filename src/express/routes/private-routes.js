'use strict';

const {Router} = require(`express`);
const privateRouter = new Router();

privateRouter.get(`/`, (_req, res) => res.send(`/my`));
privateRouter.get(`/categories`, (_req, res) => res.send(`/my/categories`));
privateRouter.get(`/comments`, (_req, res) => res.send(`/my/comments`));

module.exports = privateRouter;
