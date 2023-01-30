'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.API_PREFIX = `/api`;

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  SUCCESS_SILENT: 204,
  CLIENT_ERROR: 400,
  NOT_AUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

module.exports.ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

module.exports.Encoding = {
  UTF8: `utf-8`,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports.DatePattern = {
  DEFAULT: `YYYY-MM-DDTHH:mm:ss`,
  HUMAN_READABLE: `DD.MM.YYYY, HH:mm`,
  ROBOT_READABLE: `YYYY-MM-DDTHH:mm`,
  DATE_REVERSE: `YYYY-MM-DD`,
  DATE_ONLY: `DD.MM.YYYY`,
};

module.exports.HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

module.exports.ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

module.exports.ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  ANNOUNCE_MIN: `Описание содержит меньше 50 символов`,
  ANNOUNCE_MAX: `Описание не может содержать более 1000 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  FULL_TEXT_MAX: `публикация не может содержать более 1000 символов`,
  USER_ID: `Некорректный идентификатор пользователя`,
};

module.exports.ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`
};

module.exports.ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports.ARTICLES_PER_PAGE = 8;
module.exports.TOP_ARTICLES = 4;
module.exports.TOP_COMMENTS = 4;
module.exports.TOP_LIMIT_TEXT = 100;
