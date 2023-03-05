module.exports = (sequelize, DataTypes) => {
  const alias = 'Status'
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
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  }
  const config = {
    underscored: true,
    tableName: 'status',
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8mb4_unicode:ci'
    },
    freezeTableName: true
  }
  const Status = sequelize.define(
    alias,
    cols,
    config
  )
  Status.associate = (model) => {
    Status.belongsToMany(model.Game, {
      as: 'games',
      through: 'status_game',
      foreignKey: 'status_id',
      otherKey: 'game_id_status',
      timestamps: true
    })
  }
  return Status
}
