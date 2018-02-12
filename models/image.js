'use strict';
module.exports = (sequelize, DataTypes) => {
  var Image = sequelize.define('Image', {
    image: DataTypes.TEXT,
    text: DataTypes.TEXT
  });

  Image.associate = models => {
    Image.belongsTo(models.Paket, {
      foreignKey: 'paketId',
      onDelete: 'CASCADE'
    });
  };
  return Image;
};
