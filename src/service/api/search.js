'use strict';

const {Router} = require(`express`);
const {HTTP_CODE} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      res.status(HTTP_CODE.clientError).json([]);
      return;
    }

    const searchResults = service.findAll(query);
    const searchStatus = searchResults.length > 0 ? HTTP_CODE.ok : HTTP_CODE.notFound;

    res.status(searchStatus)
      .json(searchResults);
  });
};
