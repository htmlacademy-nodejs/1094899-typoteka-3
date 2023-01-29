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

  route.delete(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const deletedItem = await service.drop(categoryId);

    if (!deletedItem) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found`);
    }

    return res.status(HTTP_CODE.ok)
      .json(deletedItem);
  });

  route.post(`/`, async (req, res) => {
    const category = await service.create(req.body);

    return res.status(HTTP_CODE.created)
      .json(category);
  });

  route.put(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const updatedCategoryCount = await service.update(categoryId, req.body);

    return updatedCategoryCount === 0
      ? res.status(HTTP_CODE.notFound).json(updatedCategoryCount)
      : res.status(HTTP_CODE.ok).json(updatedCategoryCount);
  });
};
