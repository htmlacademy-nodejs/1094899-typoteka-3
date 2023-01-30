'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.API_PREFIX = `/api`;
module.exports.HTTP_CODE = {
  ok: 200,
  created: 201,
  successSilent: 204,
  clientError: 400,
  notAuthorized: 401,
  notFound: 404,
  serverError: 500
};
module.exports.ExitCode = {
  error: 1,
  success: 0,
};

/** @type {Record<string, BufferEncoding} */
module.exports.Encoding = {
  utf8: `utf-8`,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports.DATE_PATTERN = {
  default: `YYYY-MM-DDTHH:mm:ss`,
  humanReadable: `DD.MM.YYYY, HH:mm`,
  robotReadable: `YYYY-MM-DDTHH:mm`,
  dateReverse: `YYYY-MM-DD`,
  dateOnly: `DD.MM.YYYY`,
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
