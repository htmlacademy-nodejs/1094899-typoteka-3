'use strict';

const express = require(`express`);
const path = require(`path`);
const articleRoutes = require(`./routes/article-routes`);
const privateRoutes = require(`./routes/private-routes`);
const mainRoutes = require(`./routes/main-routes`);
const {Env} = require(`../constants`);
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const UPLOAD_DIR = `upload`;

const app = express();

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
