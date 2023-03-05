module.exports = (sequelize, DataTypes) => {
  const alias = 'Category'
  const cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
  const config = {
    underscored: true,
    tableName: 'categories',
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8mb4_unicode:ci'
    }
  }
  const Category = sequelize.define(
    alias,
    cols,
    config
  )
  Category.associate = (model) => {
    Category.belongsToMany(model.Game, {
      as: 'games',
      through: 'category_game',
      foreignKey: 'category_id',
      otherKey: 'game_id_category',
      timestamps: true
    })
  }
  return Category
}
