'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll({categoryId, needComments}) {
    const include = [
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    include.push(
        categoryId
          ? {model: this._Category, as: Aliase.CATEGORIES, where: {id: categoryId}}
          : Aliase.CATEGORIES
    );

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
    });
    return articles.map((item) => item.get());
  }

  findOne(id, needComments) {
    const include = [Aliase.CATEGORIES];
    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }
    return this._Article.findByPk(id, {include});
  }

  async findTopCommented(limit) {
    const result = await this._Article.findAll({
      attributes: [
        `Article.id`,
        [`announce`, `text`],
        [
          Sequelize.fn(
              `COUNT`,
              Sequelize.col(`comments.id`)
          ),
          `count`
        ]
      ],
      include: [{
        model: this._Comment,
        as: Aliase.COMMENTS,
        attributes: [],
      }],
      group: [`Article.id`, `Article.text`],
      order: [
        [`count`, `DESC`]
      ],
      limit,
      subQuery: false,
      having: Sequelize.where(Sequelize.fn(`count`, Sequelize.col(`comments.id`)), {
        [Sequelize.Op.gt]: 0,
      }),
      raw: true
    });

    return result;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articles: rows};
  }
}

module.exports = ArticleService;
