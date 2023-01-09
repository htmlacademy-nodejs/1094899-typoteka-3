'use strict';

const {Router} = require(`express`);
const {HTTP_CODE} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HTTP_CODE.ok)
      .json(categories);
  });
};
