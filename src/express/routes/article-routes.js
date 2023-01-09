'use strict';

const {Router} = require(`express`);
const {convertViewArticle, parseViewArticle, convertViewArticles} = require(`../adapters/view-model`);
const {Env} = require(`../../constants`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const articleRouter = new Router();
const api = require(`../api`).getAPI();

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (_req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articleRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`post-edit`, {
    article: convertViewArticle(article),
    categories
  });
});

articleRouter.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();

  res.render(`post-new`, {categories});
});

articleRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = parseViewArticle(body, file);
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    if (isDevMode) {
      console.error(error);
    }
    res.redirect(`back`);
  }
});

articleRouter.get(`/category/:id`, async (req, res) => {
  const {id: categoryId} = req.params;
  const [articles, categories] = await Promise.all([
    api.getArticles(true),
    api.getCategories(true)
  ]);
  const filteredArticle = articles.filter((x)=> x.categoryId === categoryId);
  res.render(`articles-by-category`, {
    articles: convertViewArticles(filteredArticle),
    categories
  });
});

articleRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, totalCategories] = await Promise.all([
    api.getArticle(id, true),
    api.getCategories(true)
  ]);

  res.render(`post-detail`, {
    article: convertViewArticle(article, totalCategories),
  });
});

module.exports = articleRouter;
