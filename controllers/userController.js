const { User, Profile } = require("../models");
const bcrypt = require("bcryptjs");

class userController {
  static async formRegister(req, res) {
    try {
      res.render("formRegis");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postFormRegister(req, res) {
    try {
      let { username, email, password, role } = req.body;
      let user = await User.create({ username, email, password, role });

      await Profile.create({
        UserId: user.id,
      });
      res.redirect("/login");
    } catch (error) {
      res.send(error.message);
    }
  }

  static async formLogin(req, res) {
    try {
      const { error } = req.query;
      res.render("formLogin", { error });
    } catch (error) {
      res.send(error.message);
    }
  }

  static async postLogin(req, res) {
    try {
      let { username, password } = req.body;
      let user = await User.findOne({ where: { username } });
      if (user) {
        let validPassword = bcrypt.compareSync(password, user.password);

        if (validPassword) {
          req.session.userId = user.id;
          res.redirect("/");
        } else {
          let error = "invalid username or password";
          res.redirect(`/login?error=${error}`);
        }
      } else {
        let error = "invalid username or password";
        res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      res.send(error.message);
    }
  }
  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      res.send(error.message);
    }
  }
}

module.exports = userController;
