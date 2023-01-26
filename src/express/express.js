'use strict';

const express = require(`express`);
const path = require(`path`);
const articleRoutes = require(`./routes/article-routes`);
const privateRoutes = require(`./routes/private-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {Env} = require(`../constants`);
const {getLogger} = require(`../service/lib/logger`);

const session = require(`express-session`);
const sequelize = require(`../service/lib/sequelize`);
const SequelizeStore = require(`connect-session-sequelize`)(session.Store);

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;


const logger = getLogger({name: `frontend`});

const app = express();

const {SESSION_SECRET} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET environment variable is not defined`);
}

const mySessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 180000,
  checkExpirationInterval: 60000
});

sequelize.sync({force: false});

app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: SESSION_SECRET,
  store: mySessionStore,
  resave: false,
  proxy: true,
  saveUninitialized: false,
}));

if (isDevMode) {
  app.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });
}

app.use(`/articles`, articleRoutes);
app.use(`/my`, privateRoutes);
app.use(`/`, mainRoutes);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use((req, res) => {
  if (isDevMode) {
    console.error(`Неверный путь: ${req.method} ${req.originalUrl}`);
  }
  res.status(400).render(`errors/404`);
});

app.use((err, _req, res, _next) => {
  if (isDevMode) {
    console.error(err);
  }
  res.status(500).render(`errors/500`);
});

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(process.env.PORT || DEFAULT_PORT);
