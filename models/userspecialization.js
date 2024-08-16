"use strict";
const { Model } = require("sequelize");
const { options } = require("../routers");
module.exports = (sequelize, DataTypes) => {
  class UserSpecialization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserSpecialization.belongsTo(models.User);
      UserSpecialization.belongsTo(models.Specialization);
    }
  }
  UserSpecialization.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      SpecializationId: {
        type: DataTypes.INTEGER,
        references: {
          model: "specializations",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "UserSpecialization",
    }
  );
  return UserSpecialization;
};
