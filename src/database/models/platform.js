// Voy a exportar mi modelo, con los parámetros (sequelize) y (DataTypes) <--- cuidado las mayúsculas;
module.exports = (sequelize, DataTypes) => {
  // defino el alias de mi modelo, tiene que ser igual que el archivo: SINGULAR y La Primera Mayúscula;
  const alias = 'Platform'

  // defino las columnas de la tabla, copio de lo que figura en el workbench
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
    // si uso columnas 'crated_at' & 'updated_at', tengo que hacer timestamps = true en config;
    createdAt: 'created_at',
    // éstas llevan 'TIMESTAMP' en MySQL, y aquí usamos DataTypes.DATE;
    updatedAt: 'updated_at',
    // si uso la columna 'deleted_at', tengo que hacer paranoid = true en config;
    deletedAt: 'deleted_at'
  }

  // hora de definir la configuración;
  const config = {
    underscored: true,
    // es buena práctica decirle el nombre de la tabla, ya que puede no coincidir 100% y nos ahorramos un dolor de cabeza;
    tableName: 'platforms',
    // si miramos arriba, tenemos tablas 'created_at' y 'updated_at', por eso timestamps = true;
    timestamps: true,
    // si miramos arriba, tenemos tabla 'deleted_at' por eso paranoid = true;
    paranoid: true,
    // otra definición para ahorrar dolor de cabeza: nos aseguramos de definir charset y collation para evitar cualquier problema;
    charset: 'utf8',
    dialectOptions: {
      collate: 'utf8mb4_unicode:ci'
    }
  }

  // habiendo definido todo arriba, aquí decimos lo que lleva nuestro modelo, definiéndolo;
  const Platform = sequelize.define(
    // agarrá el alias que te dije arriba;
    alias,
    // agarrá las columnas que te dije arriba;
    cols,
    // agarrá la config que te dije arriba;
    config
  )

  // en éste momento hay que decirle a sequelize las relaciones que tiene mi columna;
  Platform.associate = (model) => {
    // UNA PLATAFORMA tiene MUCHOS JUEGOS;
    // UN JUEGO se puede jugar en MUCHAS PLATAFORMAS;
    Platform.belongsToMany(model.Game, {
      // muchas plataformas, por eso va plural;
      as: 'games', // plural;
      // a través de, aquí va la tabla pivot;
      through: 'platform_game',
      // columna foreign key del modelo que estoy definiendo, en este caso "Platform";
      foreignKey: 'platform_id',
      // la otra foreign key que pertenece al modelo con el que estoy relacionando, en éste caso "Games";
      otherKey: 'game_id_platform',
      // SI LA TABLA PIVOT TIENE COLUMNAS "created_at", "updated_at":
      timestamps: true
      // timestamps: true // si no, por default es false así que no decimos nada;
      // si la tabla pivot tiene éstas columnas y decimos timestamps: true, tendremos que crear un modelo para la tabla pivot también, si no no es necesario;
    })
  }

  // SOLO ME QUEDA HACER RETURN DE LO QUE DEFINÍ:
  return Platform
}
