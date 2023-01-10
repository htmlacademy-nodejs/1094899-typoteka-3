"use strict";

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {

}

const define = (sequelize) => Article.init({
  title: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(255),
    allowNull: false
  },
  announce: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(2000),
    allowNull: false
  },
  text: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(4000),
    allowNull: false
  },
  // eslint-disable-next-line new-cap
  image: DataTypes.STRING(50),
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`
});

module.exports = define;
