'use strict';

const {Router} = require(`express`);
const {HTTP_CODE} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/category`, route);

  route.get(`/`, async (_req, res) => {
    const categories = await service.findAll();
    res.status(HTTP_CODE.ok)
      .json(categories);
  });
};
