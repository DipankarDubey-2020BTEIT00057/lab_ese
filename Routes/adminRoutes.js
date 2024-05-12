const adminControllers = require("./../Controllers/adminControllers");
const loginControllers = require("./../Controllers/loginControllers");

const express = require("express");

const Router = express.Router();

Router.route("/").get(loginControllers.protect, adminControllers.homePage);

Router.route("/gallery")
  .get(loginControllers.protect, adminControllers.gallery)
  .post(adminControllers.gallerydelete);

Router.route("/register")
  .get(loginControllers.protect, adminControllers.register)
  .post(adminControllers.registerSave);

Router.route("/addbanner")
  .get(loginControllers.protect, adminControllers.addbanner)
  .post(adminControllers.addbannerSave);

Router.route("/productform")
  .get(loginControllers.protect, adminControllers.productform)
  .post(adminControllers.gallerySave);

Router.route("/addslider")
  .get(loginControllers.protect, adminControllers.addslider)
  .post(adminControllers.addsliderSave);

Router.route("/deleteslider").post(adminControllers.deleteslider);
Router.route("/deletebanner").post(adminControllers.deletebanner);

Router.route("/back").get(adminControllers.back);

Router.route("/Message-sending").get(
  loginControllers.protect,
  adminControllers.MessageSending
);
Router.route("/Messagediscount").post(adminControllers.Messagediscount);
Router.route("/MessageBirthday").post(adminControllers.MessageBirthday);

Router.route("/scan").get(loginControllers.protect, adminControllers.scan);

//Router.route("/otp").get(adminControllers.otp).post(adminControllers.loginSend);

module.exports = Router;
