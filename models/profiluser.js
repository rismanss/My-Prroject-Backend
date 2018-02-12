'use strict';
module.exports = (sequelize, DataTypes) => {
  var Profiluser = sequelize.define('Profiluser', {
    name: DataTypes.STRING,
    tlpn: DataTypes.BIGINT,
    description: DataTypes.TEXT,
    image: DataTypes.TEXT,
    address: DataTypes.TEXT
  });

  Profiluser.associate = models => {
    Profiluser.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Profiluser;
};
