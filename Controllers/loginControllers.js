const nodemailer = require("nodemailer");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const Login = require("./../model/login_model");

exports.login = (req, res) => {
  res.render("admin");
};

let OTP;
exports.loginSend = async (req, res) => {
  const enterEmail = req.body.Email;
  //const enterOtp = req.body.passward;
  await Login.find({ Email: enterEmail }).then(async (re) => {
    if (re) {
      OTP = Math.floor(Math.random() * 9000) + 1000;
      //OTP = 1111;
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "ddubey10032003@gmail.com",
          pass: "qcifrzphugnukief",
        },
      });
      if (enterEmail == "ddubey10032002@gmail.com") {
        transporter.sendMail(
          {
            from: "ddubey10032003@gmail.com",
            to: "ddubey10032002@gmail.com",
            subject: "Your OTP",
            text: `${OTP}`,
          },
          (err, info) => {
            if (err) {
              console.log(err);
              res.redirect("/login");
            } else {
              console.log(OTP);
              res.render("otp");
            }
          }
        );
      } else {
        res.redirect("/login");
        console.log("enter correct email");
      }

      // });
    } else {
      console.log("Wrong Email");
    }
  });
};

exports.loginOtp = (req, res) => {
  let enterOTP = Number(req.body.Email);
  if (enterOTP === OTP) {
    const secret = "my-secret-string-used-in-formation-of-token";
    const expiresIn = 3 * 24 * 60 * 60;
    const _id = "6354de1fcdb6219dd19828e5";
    const token = jwt.sign({ _id }, secret, {
      expiresIn,
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      expiresIn: expiresIn * 1000,
    });
    res.status(201).redirect("/login/Admin");
  } else {
    console.log(enterOTP);
  }
};

exports.protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (!token) {
    res.redirect("/login");
  } else {
    const secret = "my-secret-string-used-in-formation-of-token";

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  }
};
