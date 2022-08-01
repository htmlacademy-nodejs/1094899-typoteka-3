'use strict';

module.exports.contentTypeBuilder = (MIMEType, Charset) => {
  return `${MIMEType}; charset=${Charset.toUpperCase()}`;
};
