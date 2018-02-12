'use strict';
module.exports = (sequelize, DataTypes) => {
  var Paket = sequelize.define('Paket', {
    title: DataTypes.STRING,
    price: DataTypes.BIGINT,
    description: DataTypes.TEXT,
    kota: DataTypes.STRING
  });

  Paket.associate = models => {
    Paket.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Paket.hasMany(models.Image, {
      foreignKey: 'paketId',
      as: 'Image'
    });
  };
  return Paket;
};
