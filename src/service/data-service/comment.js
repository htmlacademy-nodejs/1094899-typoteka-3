'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });

    return !!deletedRows;
  }

  findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  findLast(limit) {
    return this._Comment.findAll({
      attributes: [
        `id`,
        `text`,
        `articleId`
      ],
      include: {
        model: this._User,
        as: Aliase.USERS,
        attributes: [
          `avatar`,
          `name`
        ]
      },
      order: [
        [`createdAt`, `DESC`]
      ],
      limit,
      raw: true
    });
  }

}

module.exports = CommentService;
