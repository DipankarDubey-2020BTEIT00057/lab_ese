const userControllers = require("./../Controllers/userControllers");

const express = require("express");

const Router = express.Router();

Router.route("/").get(userControllers.homePage);
Router.route("/Gallery").get(userControllers.gallery);
Router.route("/contact_us")
  .get(userControllers.contact_us)
  .post(userControllers.query);

module.exports = Router;
