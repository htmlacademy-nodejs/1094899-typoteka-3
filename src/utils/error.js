'use strict';

module.exports.prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};
