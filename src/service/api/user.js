'use strict';

const {Router} = require(`express`);
const {HttpCode, ErrorAuthMessage} = require(`../../constants`);

const userValidator = require(`../middlewares/user-validator`);

const passwordUtils = require(`../lib/password`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;
    data.passwordHash = await passwordUtils.hash(data.password);

    const result = await service.create(data);

    delete result.passwordHash;

    res.status(HttpCode.SUCCESS_SILENT)
      .json(result);
  });

  route.post(`/auth`, async (req, res) => {
    const {email, password} = req.body;
    const user = await service.findByEmail(email);

    if (!user) {
      res.status(HttpCode.NOT_AUTHORIZED).send(ErrorAuthMessage.EMAIL);
      return;
    }

    const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);

    if (passwordIsCorrect) {
      delete user.passwordHash;
      res.status(HttpCode.OK).json(user);
    } else {
      res.status(HttpCode.NOT_AUTHORIZED).send(ErrorAuthMessage.PASSWORD);
    }
  });
};
