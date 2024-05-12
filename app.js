const express = require("express");
const LoginRoute = require("./Routes/loginRoutes");
const UserRoute = require("./Routes/userRoutes");
const AdminRoute = require("./Routes/adminRoutes");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");

app.use(express.json());
app.set("view engine", "ejs");
app.set(path.join(__dirname, "public"));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", UserRoute);
app.use("/login", LoginRoute);
app.use("/login/Admin", AdminRoute);

module.exports = app;
