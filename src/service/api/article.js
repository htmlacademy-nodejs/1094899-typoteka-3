'use strict';

const {Router} = require(`express`);
const {HTTP_CODE} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);


module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  /** ресурс возвращает список публикаций */
  route.get(`/`, async (req, res) => {
    const {categoryId} = req.query;
    const {comments} = req.query;
    const articles = await articleService.findAll(categoryId, comments);
    res.status(HTTP_CODE.ok).json(articles);
  });

  /** возвращает полную информацию о публикации */
  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;

    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HTTP_CODE.ok)
      .json(article);
  });

  /** создаёт новую публикацию */
  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    return res.status(HTTP_CODE.created)
      .json(article);
  });

  /** редактирует определённую публикацию */
  route.put(`/:articleId`, articleValidator, async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articleService.findOne(articleId);

    if (!existArticle) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found with ${articleId}`);
    }

    const updatedArticle = await articleService.update(articleId, req.body);

    return res.status(HTTP_CODE.ok)
      .json(updatedArticle);
  });

  /** удаляет определённую публикацию */
  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found`);
    }

    return res.status(HTTP_CODE.ok)
      .json(article);
  });

  /** возвращает список комментариев определённой публикации */
  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article.id);

    res.status(HTTP_CODE.ok)
      .json(comments);
  });

  /** удаляет из определённой публикации комментарий */
  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(article, commentId);

    if (!deletedComment) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found`);
    }

    return res.status(HTTP_CODE.ok)
      .json(deletedComment);
  });

  /** создаёт новый комментарий */
  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article, req.body);

    return res.status(HTTP_CODE.created)
      .json(comment);
  });
};
