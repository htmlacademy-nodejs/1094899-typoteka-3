'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (_req, res) => res.send(`/`));
mainRouter.get(`/register`, (_req, res) => res.send(`/register`));
mainRouter.get(`/login`, (_req, res) => res.send(`/login`));
mainRouter.get(`/search`, (_req, res) => res.send(`/search`));

module.exports = mainRouter;
