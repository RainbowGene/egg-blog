'use strict';
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;
  // 配置（重要：一定要配置详细，一定要！！！）
  const Article = app.model.define('article', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '创作人id',
      //  定义外键（重要）
      references: {
        model: 'user', // 对应表名称（数据表名称）
        key: 'id' // 对应表的主键
      },
      onUpdate: 'restrict', // 更新时操作
      onDelete: 'cascade'  // 删除时操作
    },
    type_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '所属类别id',
      //  定义外键（重要）
      references: {
        model: 'type', // 对应表名称（数据表名称）
        key: 'id' // 对应表的主键
      },
      onUpdate: 'restrict', // 更新时操作
      onDelete: 'cascade'  // 删除时操作
    },
    title: {
      type: STRING(50),
      allowNull: false,
      defaultValue: '',
      comment: '文章标题',
    },
    cover: {
      type: TEXT,
      allowNull: false,
      defaultValue: '',
      comment: '文章封面',
    },
    content: {
      type: TEXT,
      allowNull: false,
      defaultValue: '',
      comment: '文章内容',
    },
    created_at: DATE,
    updated_at: DATE
  });

  Article.associate = function (model) {
    Article.belongsTo(app.model.User, {
      foreignKey: 'user_id'
    });

    Article.belongsTo(app.model.Type, {
      foreignKey: 'type_id'
    });
    
    // 多对多（标签）
    Article.belongsToMany(app.model.Tag, {
      through: 'article_tag',
      foreignKey: 'article_id'
    })
  }

  return Article;
};