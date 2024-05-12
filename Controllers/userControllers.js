const Banner = require("./../model/banner_model");
const Slider = require("./../model/slider_model");
const Gallery = require("./../model/gallery_model");
const nodemailer = require("nodemailer");

let post;
const poster = async () => {
  post = await Slider.find();
  post = JSON.stringify(post);
  post = JSON.parse(post);
};

let ban;
const banner = async () => {
  ban = await Banner.find();
  ban = JSON.stringify(ban);
  ban = JSON.parse(ban);
};

let data;
//Displaying gallery Start
const product = async () => {
  data = await Gallery.find();
  data = JSON.stringify(data);
  data = JSON.parse(data);
};

let allData = new Object();
exports.homePage = async (req, res) => {
  await product().then(async () => {
    await poster().then(async () => {
      await banner().then(() => {
        (allData.data = data), (allData.post = post), (allData.ban = ban);
        res.render("userIndex", { allData: allData });
      });
    });
  });
};

exports.gallery = async (req, res) => {
  await product().then(() => {
    res.render("userGallery", { data1: data });
  });
};

exports.contact_us = (req, res) => {
  res.render("contact_us");
};

exports.query = (req, res) => {
  let email = req.body.Email;
  let name = req.body.name;
  let issue = req.body.message;
  let transporter1 = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ddubey10032003@gmail.com",
      pass: "qcifrzphugnukief",
    },
  });

  transporter1.sendMail(
    {
      from: email,
      to: "ddubey10032002@gmail.com",
      subject: "Issue",
      text: `I am ${name} my  issue is ${issue}`,
    },
    (err, info) => {
      if (err) {
        console.log(err);
        res.redirect("/contact_us");
      } else {
        // console.log(OTP);
        res.redirect("/contact_us");
        //  res.render("otp");
      }
    }
  );
};
