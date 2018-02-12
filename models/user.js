'use strict';
const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    'User',
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: User => {
          const salt = bcrypt.genSaltSync();
          User.password = bcrypt.hashSync(User.password, salt);
        }
      }
    }
  );

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.associate = models => {
    User.hasOne(models.Profiluser, {
      foreignKey: 'userId',
      as: 'Profiluser'
    });
    User.hasMany(models.Paket, {
      foreignKey: 'userId',
      as: 'Paket'
    });
  };
  return User;
};
