'use strict';

const help = require(`./help`);
const filldb = require(`./filldb`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const fillSchema = require(`./filldb-schema`);

const Cli = {
  [filldb.name]: filldb,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
  [fillSchema.name]: fillSchema,
};

module.exports = {
  Cli,
};

