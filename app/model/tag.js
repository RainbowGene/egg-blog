'use strict';
const crypto = require('crypto');
module.exports = app => {
  const { INTEGER, STRING, DATE, ENUM } = app.Sequelize;
  // 配置（重要：一定要配置详细，一定要！！！）
  const Tag = app.model.define('tag', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '标签名称',
      unique: true
    },
    created_at: DATE,
    updated_at: DATE
  });

  Tag.associate = function (model) {
    // 多对多（标签）  标签可以被多个文章使用，文章可以有多个标签
    Tag.belongsToMany(app.model.Article, {
      through: 'article_tag',
      foreignKey: 'tag_id'
    })
  }

  return Tag;
};