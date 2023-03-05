module.exports = (sequelize, DataTypes) => {
  const alias = 'UserGame'
  const cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    gameId: {
      type: DataTypes.INTEGER,
      field: 'game_id_user'
    },
    userId: {
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  const config = {
    underscored: true,
    tableName: 'user_game',
    timestamps: true,
    paranoid: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8mb4_unicode:ci'
    },
    freezeTableName: true
  }
  const UserGame = sequelize.define(
    alias,
    cols,
    config
  )
  UserGame.associate = (model) => {
    UserGame.belongsTo(model.User, {
      foreignKey: 'user_id'
    })
    UserGame.belongsTo(model.Game, {
      foreignKey: 'game_id_user'
    })
  }
  return UserGame
}
