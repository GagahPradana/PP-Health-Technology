"use strict";
const { Model, Op } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile);
      User.hasMany(models.UserSpecialization);
      // define association here
    }
    static async getDoctorList(filter) {
      try {
        let doctors;

        if (filter) {
          doctors = await User.findAll({
            where: {
              role: "dokter",
              username: {
                [Op.iLike]: `%${filter}%`,
              },
            },
            include: {
              model: sequelize.models.UserSpecialization,
              include: sequelize.models.Specialization,
            },
          });
        } else {
          doctors = await User.findAll({
            where: {
              role: "dokter",
            },
            include: {
              model: sequelize.models.UserSpecialization,
              include: sequelize.models.Specialization,
            },
          });
        }

        // let doctors = await User.findAll({
        //   where: {
        //     role: "dokter",
        //   },
        //   include: {
        //     model: sequelize.models.UserSpecialization,
        //     include: sequelize.models.Specialization,
        //   },
        // });
        // console.log(doctors);

        doctors = doctors.map((el) => {
          let { username, UserSpecializations } = el;
          UserSpecializations = UserSpecializations.map((element) => {
            return element.Specialization.specializationName;
          }).join(", ");
          return { username, UserSpecializations };
        });
        return doctors;
      } catch (error) {
        throw error;
      }
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate(instance, options) {
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(instance.password, salt);

          instance.password = hash;
          instance.role = "pasien";
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
