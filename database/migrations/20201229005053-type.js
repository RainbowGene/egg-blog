'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable('type', {
      id: {
        type: INTEGER(20).UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      typeof_id: {
        type: INTEGER(20),
        defaultValue: 0,
        comment: '所属类别',
      },
      typename: {
        type: STRING(30),
        allowNull: false,
        defaultValue: '',
        comment: '类别名',
        unique: true
      },
      created_at: DATE,
      updated_at: DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('type'); // 回滚删除
  }
};
