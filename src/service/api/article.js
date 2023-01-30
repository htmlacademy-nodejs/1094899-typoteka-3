'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/article-validator`);
const articleExist = require(`../middlewares/article-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);


module.exports = (app, articleService, commentService) => {
  const route = new Router();
  app.use(`/articles`, route);

  /** ресурс возвращает список публикаций */
  route.get(`/`, async (req, res) => {
    const {offset, limit, categoryId, comments} = req.query;
    let result;
    if (limit || offset) {
      result = await articleService.findPage({limit, offset});
    } else {
      result = await articleService.findAll({categoryId, needComments: comments});
    }
    res.status(HttpCode.OK).json(result);
  });

  /** возвращает полную информацию о публикации */
  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;

    const article = await articleService.findOne(articleId, comments);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  /** создаёт новую публикацию */
  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);
    return res.status(HttpCode.CREATED)
      .json(article);
  });

  /** редактирует определённую публикацию */
  route.put(`/:articleId`, [routeParamsValidator, articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const existArticle = await articleService.findOne(articleId);

    if (!existArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }
    const updatedArticle = await articleService.update(articleId, req.body);

    return res.status(HttpCode.OK)
      .json(updatedArticle);
  });

  /** удаляет определённую публикацию */
  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.drop(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(article);
  });

  /** возвращает список комментариев определённой публикации */
  route.get(`/:articleId/comments`, [articleExist(articleService), routeParamsValidator], async (req, res) => {
    const {article} = res.locals;
    const comments = await commentService.findAll(article.id);

    res.status(HttpCode.OK)
      .json(comments);
  });

  /** удаляет из определённой публикации комментарий */
  route.delete(`/:articleId/comments/:commentId`, [articleExist(articleService), routeParamsValidator], async (req, res) => {
    const {commentId} = req.params;
    const deletedComment = await commentService.drop(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .json(deletedComment);
  });

  /** создаёт новый комментарий */
  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentService.create(article.id, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });

  /** получить топ самых комментируемых статей */
  route.get(`/top/:limit`, async (req, res) => {
    const {limit} = req.params;
    const result = await articleService.findTopCommented(limit);

    return res.status(HttpCode.OK)
      .json(result);
  });

  /** получить последние комментарии комментируемых */
  route.get(`/top/comments/:limit`, async (req, res) => {
    const {limit} = req.params;
    const result = await commentService.findLast(limit);

    return res.status(HttpCode.OK)
        .json(result);
  });
};
