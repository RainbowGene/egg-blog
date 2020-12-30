'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM, TEXT } = Sequelize;
    await queryInterface.createTable('article', {
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('article');
  }
};
