//Model Booking
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spot, { foreignKey: 'spotId' });
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Booking.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Spots",
        key: "id",
      },
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    endDate: {
      allowNull: false,
      type:DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};