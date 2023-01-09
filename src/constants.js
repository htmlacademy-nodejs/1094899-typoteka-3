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

module.exports.MIME = {
  plainText: `text/plain`,
  html: `text/html`
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports.DATE_PATTERN = {
  default: `YYYY-MM-DDTHH:mm:ssZ[Z]`, // `YYYY-MM-DD HH:mm:ss`,
  humanReadable: `DD.MM.YYYY, HH:mm`,
  robotReadable: `YYYY-MM-DDTHH:mm`,
  dateReverse: `YYYY-MM-DD`,
  dateOnly: `DD.MM.YYYY`,
};
