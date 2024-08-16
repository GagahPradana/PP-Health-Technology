const { Where, Op, where, DATE } = require("sequelize");
const {
  User,
  Profile,
  Specialization,
  Appointment,
  UserSpecialization,
} = require("../models");
const { formatRupiah } = require("../helper/formatRupiah");

class Controller {
  static async home(req, res) {
    try {
      const userId = req.session.userId;
      res.render("home", { userId });
    } catch (error) {
      res.send(error);
    }
  }

  static async doctorDetail(req, res) {
    try {
      const { search } = req.query;

      const doctors = await User.getDoctorList(search);

      res.render("doctorDetail", { doctors });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async appointmentList(req, res) {
    try {
      const UserId = req.session.userId;
      let data = await Appointment.findAll({
        where: { UserId: UserId },
      });

      res.render("appointmentList", { data });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async doctorSpecializationList(req, res) {
    try {
      let data = await Specialization.findAll({
        // include: {
        //   model: User,
        // },
      });

      res.render("specializationList", { data, formatRupiah });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async createAppointment(req, res) {
    try {
      res.render("createAppointment");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postAppointment(req, res) {
    try {
      // console.log(req.body);
      let UserId = req.session.userId;
      let { name, dokter, appointmentDate } = req.body;
      await Appointment.create({
        name,
        dokter,
        appointmentDate: appointmentDate,
        UserId,
      });
      res.redirect(`/appointment`);
    } catch (error) {
      res.send(error.message);
    }
  }
  static async editAppointment(req, res) {
    try {
      let { errors } = req.query;
      // console.log(errors, "/////");
      let { id } = req.params;
      let appointment = await Appointment.findByPk(+id);
      res.render("editAppointment", { appointment, errors });
    } catch (error) {
      res.send(error.message);
    }
  }
  static async postEditAppointment(req, res) {
    try {
      console.log(req.body);
      let { id } = req.params;
      let { name, dokter, appointmentDate } = req.body;
      await Appointment.update(
        {
          name,
          dokter,
          appointmentDate,
        },
        {
          where: {
            id: +id,
          },
        }
      );
      res.redirect("/appointment");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        let errors = error.errors.map((el) => el.message);
        const { id } = req.params;
        res.redirect(`/appointment/edit/${id}?errors=${errors}`);
      } else {
        res.send(error);
      }
    }
  }
  static async deleteAppointment(req, res) {
    try {
      let { id } = req.params;
      await Appointment.destroy({ where: { id: +id } });
      res.redirect("/appointment");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async showProfile(req, res) {
    try {
      const { id } = req.params;
      let data = await Profile.findByPk(id);
      res.render("profile", { data });
    } catch (error) {
      res.send(error.message);
    }
  }

  // static async getDoctorUser(req, res) {
  //   try {
  //     const { filter } = req.query;
  //     const doctors = await User.getDoctorList();
  //     console.log(doctors, "=====");

  //     res.render("doctorDetail", { doctors });
  //   } catch (error) {
  //     res.send(error.message);
  //   }
  // }
}

module.exports = Controller;
