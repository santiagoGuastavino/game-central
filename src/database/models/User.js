module.exports = (sequelize, DataTypes) => {
  const alias = 'User'
  const cols = {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    newsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255)
    },
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  const config = {
    underscored: true,
    tableName: 'users',
    timestamps: true,
    paranoid: false,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8mb4_unicode:ci'
    }
  }
  const User = sequelize.define(
    alias,
    cols,
    config
  )
  User.associate = (model) => {
    User.belongsToMany(model.Game, {
      as: 'games',
      through: 'user_game',
      foreignKey: 'user_id',
      otherKey: 'game_id_user',
      timestamps: true
    })
  }
  return User
}
