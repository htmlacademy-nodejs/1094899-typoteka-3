'use strict';

const {Router} = require(`express`);
const {convertViewArticle, parseViewArticle, convertViewArticles} = require(`../adapters/view-model`);
const {Env} = require(`../../constants`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils/error`);

const articleRouter = new Router();
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async (articleId) => {
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  return [article, categories];
};

const getViewArticleData = async (articleId, comments) => {
  const [article, totalCategories] = await Promise.all([
    api.getArticle(articleId, comments),
    api.getCategories(true)
  ]);
  return [article, totalCategories];
};

articleRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);
  res.render(`post-edit`, {
    id,
    article: convertViewArticle(article),
    categories
  });
});

articleRouter.post(`/edit/:id`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const articleData = parseViewArticle(body, file);
  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, categories] = await getEditArticleData(id);
    res.render(`post-edit`, {
      id,
      article: convertViewArticle(article),
      categories,
      validationMessages
    });
  }
});

articleRouter.get(`/add`, async (_req, res) => {
  const categories = await getAddArticleData();

  res.render(`post-new`, {categories});
});

articleRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = parseViewArticle(body, file);
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    if (isDevMode) {
      console.error(errors);
    }
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`post-new`, {categories, validationMessages});
  }
});

articleRouter.get(`/category/:id`, async (req, res) => {
  const {id: categoryId} = req.params;
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true, categoryId}),
    api.getCategories(true)
  ]);

  res.render(`articles-by-category`, {
    articles: convertViewArticles(articles),
    categories,
    categoryId
  });
});

articleRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, totalCategories] = await getViewArticleData(id, true);

  res.render(`post-detail`, {
    article: convertViewArticle(article, totalCategories),
    id
  });
});

articleRouter.post(`/:id/comments`, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {comment} = req.body;
  try {
    await api.createComment(id, {userId: user.id, text: comment});
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, totalCategories] = await getViewArticleData(id, true);
    res.render(`post-detail`, {
      article: convertViewArticle(article, totalCategories),
      id,
      validationMessages
    });
  }
});

module.exports = articleRouter;
