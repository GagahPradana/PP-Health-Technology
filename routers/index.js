const router = require("express").Router();
const Controller = require("../controllers/controller");
const userController = require("../controllers/userController");

const isLogin = (req, res, next) => {
  if (
    req.session.userId &&
    (req.path === "/login" || req.path === "/register")
  ) {
    res.redirect(`/`);
  } else {
    next();
  }
};

router.get("/register", isLogin, userController.formRegister);
router.post("/register", userController.postFormRegister);

router.get("/login", isLogin, userController.formLogin);
router.post("/login", userController.postLogin);

router.use((req, res, next) => {
  if (!req.session.userId) {
    let error = "Please login first!";
    res.redirect(`/login?error=${error}`);
  } else {
    next();
  }
});

router.get("/", Controller.home);
router.get("/logout", userController.logout);
router.get("/profile/:id", Controller.showProfile);
router.get("/doctor/detail", Controller.doctorDetail);
router.get("/doctor/specialization", Controller.doctorSpecializationList);
router.get("/appointment", Controller.appointmentList);
router.get("/appointment/create", Controller.createAppointment);
router.post("/appointment/create", Controller.postAppointment);
router.get("/appointment/edit/:id", Controller.editAppointment);
router.post("/appointment/edit/:id", Controller.postEditAppointment);
router.get("/appointment/delete/:id", Controller.deleteAppointment);

module.exports = router;
