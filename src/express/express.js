'use strict';

const express = require(`express`);
const articleRoutes = require(`./routes/article-routes`);
const privateRoutes = require(`./routes/private-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/articles`, articleRoutes);
app.use(`/my`, privateRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT);
