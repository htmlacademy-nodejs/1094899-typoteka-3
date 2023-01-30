'use strict';

const {Router} = require(`express`);
const {convertViewArticle, parseViewArticle, convertViewArticles} = require(`../adapters/view-model`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils/error`);
const auth = require(`../middlewares/auth`);
const adminAuth = require(`../middlewares/admin-auth`);
const csrf = require(`csurf`);

const csrfProtection = csrf();
const articleRouter = new Router();

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

articleRouter.get(`/edit/:id`, adminAuth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, categories] = await getEditArticleData(id);
  res.render(`post-edit`, {
    id,
    article: convertViewArticle(article),
    categories,
    user,
    csrfToken: req.csrfToken(),
  });
});

articleRouter.post(`/edit/:id`, adminAuth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const {id} = req.params;
  const articleData = parseViewArticle(body, file, user);
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
      validationMessages,
      user,
      csrfToken: req.csrfToken(),
    });
  }
});

articleRouter.get(`/add`, adminAuth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddArticleData();

  res.render(`post-new`, {categories, user, csrfToken: req.csrfToken()});
});

articleRouter.post(`/add`, adminAuth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {body, file} = req;
  const articleData = parseViewArticle(body, file, user);
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    res.render(`post-new`, {
      categories,
      validationMessages,
      user,
      csrfToken: req.csrfToken(),
    });
  }
});

articleRouter.get(`/category/:id`, async (req, res) => {
  const {user} = req.session;
  const {id: categoryId} = req.params;
  const [articles, categories] = await Promise.all([
    api.getArticles({comments: true, categoryId}),
    api.getCategories(true)
  ]);

  res.render(`articles-by-category`, {
    articles: convertViewArticles(articles),
    categories,
    categoryId,
    user,
  });
});

articleRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const [article, totalCategories] = await getViewArticleData(id, true);

  res.render(`post-detail`, {
    article: convertViewArticle(article, totalCategories),
    id,
    user,
    csrfToken: req.csrfToken(),
    referrer: req.get(`Referrer`) || req.baseUrl,
  });
});

articleRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const {id} = req.params;
  const {message} = req.body;
  try {
    await api.createComment(id, {userId: user.id, text: message});
    res.redirect(`/articles/${id}#comments`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, totalCategories] = await getViewArticleData(id, true);
    res.render(`post-detail`, {
      article: convertViewArticle(article, totalCategories),
      id,
      validationMessages,
      user,
      csrfToken: req.csrfToken(),
    });
  }
});

module.exports = articleRouter;
