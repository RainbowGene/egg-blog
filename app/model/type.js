
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM, TEXT } = app.Sequelize;
  // 配置（重要：一定要配置详细，一定要！！！）
  const Type = app.model.define('type', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    typeof_id: {
      type: INTEGER(20),
      defaultValue: 0,
      comment: '所属类别'
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

  // 定义关联关系
  Type.associate = function (model) {
    Type.hasMany(app.model.Article, {
      foreignKey: 'type_id'
    });
  }

  return Type;
};