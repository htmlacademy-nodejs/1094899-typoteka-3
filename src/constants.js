'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const API_PREFIX = `/api`;

const HttpCode = {
  OK: 200,
  CREATED: 201,
  SUCCESS_SILENT: 204,
  CLIENT_ERROR: 400,
  NOT_AUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0,
};

const Encoding = {
  UTF8: `utf-8`,
};

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const DatePattern = {
  DEFAULT: `YYYY-MM-DDTHH:mm:ss`,
  HUMAN_READABLE: `DD.MM.YYYY, HH:mm`,
  ROBOT_READABLE: `YYYY-MM-DDTHH:mm`,
  DATE_REVERSE: `YYYY-MM-DD`,
  DATE_ONLY: `DD.MM.YYYY`,
};

const HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ErrorCommentMessage = {
  TEXT: `Комментарий содержит меньше 20 символов`,
  USER_ID: `Некорректный идентификатор пользователя`
};

const ErrorArticleMessage = {
  CATEGORIES: `Не выбрана ни одна категория объявления`,
  TITLE_MIN: `Заголовок содержит меньше 10 символов`,
  TITLE_MAX: `Заголовок не может содержать более 100 символов`,
  ANNOUNCE_MIN: `Описание содержит меньше 50 символов`,
  ANNOUNCE_MAX: `Описание не может содержать более 1000 символов`,
  PICTURE: `Изображение не выбрано или тип изображения не поддерживается`,
  FULL_TEXT_MAX: `публикация не может содержать более 1000 символов`,
  USER_ID: `Некорректный идентификатор пользователя`,
};

const ErrorRegisterMessage = {
  NAME: `Имя содержит некорректные символы`,
  EMAIL: `Некорректный электронный адрес`,
  EMAIL_EXIST: `Электронный адрес уже используется`,
  PASSWORD: `Пароль содержит меньше 6-ти символов`,
  PASSWORD_REPEATED: `Пароли не совпадают`,
  AVATAR: `Изображение не выбрано или тип изображения не поддерживается`
};

const ErrorAuthMessage = {
  EMAIL: `Электронный адрес не существует`,
  PASSWORD: `Неверный пароль`
};

const ARTICLES_PER_PAGE = 8;
const TOP_ARTICLES = 4;
const TOP_COMMENTS = 4;
const TOP_LIMIT_TEXT = 100;

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  API_PREFIX,
  HttpCode,
  ExitCode,
  Encoding,
  Env,
  DatePattern,
  HttpMethod,
  ErrorCommentMessage,
  ErrorArticleMessage,
  ErrorRegisterMessage,
  ErrorAuthMessage,
  ARTICLES_PER_PAGE,
  TOP_ARTICLES,
  TOP_COMMENTS,
  TOP_LIMIT_TEXT,
};
