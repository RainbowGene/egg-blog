'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, ENUM } = Sequelize;
    // 创建表
    await queryInterface.createTable('tag', {
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
  },

  down: async queryInterface => {
    await queryInterface.dropTable('tag');
  }
};