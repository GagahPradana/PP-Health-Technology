"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      // define association here
      Appointment.belongsTo(models.User);
    }

    get formatDate() {
      return new Date(this.appointmentDate).toISOString().slice(0, 10);
    }
  }

  Appointment.init(
    {
      UserId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name cannot be empty.",
          },
          notNull: {
            msg: "Name cannot be empty.",
          },
        },
      },
      dokter: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Doctor name cannot be empty.",
          },
          notNull: {
            msg: "Name cannot be empty.",
          },
        },
      },
      appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: {
            msg: "Appointment date must be a valid date.",
          },
          isFutureDate(value) {
            if (new Date(value) < new Date()) {
              throw new Error("Appointment date must be in the future.");
            }
          },
        },
        get() {
          let date = this.getDataValue("appointmentDate");
          return date ? date.toDateString() : null;
        },
      },
    },
    {
      sequelize,
      modelName: "Appointment",
    }
  );

  return Appointment;
};
