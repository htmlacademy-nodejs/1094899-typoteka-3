'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();
  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const deletedItem = await service.drop(categoryId);

    if (!deletedItem) {
      return res.status(HttpCode.notFound)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedItem);
  });

  route.post(`/`, async (req, res) => {
    const category = await service.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(category);
  });

  route.put(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const updatedCategoryCount = await service.update(categoryId, req.body);

    return updatedCategoryCount === 0
      ? res.status(HttpCode.NOT_FOUND).json(updatedCategoryCount)
      : res.status(HttpCode.OK).json(updatedCategoryCount);
  });
};
