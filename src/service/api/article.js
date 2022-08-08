'use strict';

const {Router} = require(`express`);
const {HTTP_CODE} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);

const route = new Router();

module.exports = (app, articleService, commentService) => {
  app.use(`/articles`, route);

  /** ресурс возвращает список публикаций */
  route.get(`/`, (_req, res) => {
    const articles = articleService.findAll();
    res.status(HTTP_CODE.ok).json(articles);
  });

  /** возвращает полную информацию о публикации */
  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HTTP_CODE.ok)
      .json(article);
  });

  /** создаёт новую публикацию */
  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HTTP_CODE.created)
      .json(article);
  });

  /** редактирует определённую публикацию */
  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const existArticle = articleService.findOne(articleId);

    if (!existArticle) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found with ${articleId}`);
    }

    const updatedArticle = articleService.update(articleId, req.body);

    return res.status(HTTP_CODE.ok)
      .json(updatedArticle);
  });

  /** удаляет определённую публикацию */
  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.drop(articleId);

    if (!article) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found`);
    }

    return res.status(HTTP_CODE.ok)
      .json(article);
  });

  /** возвращает список комментариев определённой публикации */
  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    res.status(HTTP_CODE.ok)
      .json(comments);

  });

  /** удаляет из определённой публикации комментарий */
  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.drop(article, commentId);

    if (!deletedComment) {
      return res.status(HTTP_CODE.notFound)
        .send(`Not found`);
    }

    return res.status(HTTP_CODE.ok)
      .json(deletedComment);
  });

  /** создаёт новый комментарий */
  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HTTP_CODE.created)
      .json(comment);
  });
};
