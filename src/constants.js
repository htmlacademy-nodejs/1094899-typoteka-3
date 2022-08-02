'use strict';

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.HTTP_CODE = {
  ok: 200,
  clientError: 400,
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
