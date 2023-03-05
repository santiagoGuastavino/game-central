module.exports = (sequelize, DataTypes) => {
  const alias = 'CategoryGame'
  const cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    gameId: {
      type: DataTypes.INTEGER,
      field: 'game_id_category'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      field: 'category_id'
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  const config = {
    underscored: true,
    tableName: 'category_game',
    timestamps: true,
    paranoid: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8mb4_unicode:ci'
    },
    freezeTableName: true
  }
  const CategoryGame = sequelize.define(
    alias,
    cols,
    config
  )
  CategoryGame.associate = (model) => {
    CategoryGame.belongsTo(model.Category, {
      foreignKey: 'category_id'
    })
    CategoryGame.belongsTo(model.Game, {
      foreignKey: 'game_id_category'
    })
  }
  return CategoryGame
}
