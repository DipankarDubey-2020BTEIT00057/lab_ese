const Banner = require("./../model/banner_model");
const Slider = require("./../model/slider_model");
const Gallery = require("./../model/gallery_model");
const Message = require("./../model/message_model");
const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const QRCode = require("qrcode");
const path = require("path");
const customerData = require("./../model/messaging_number");
const mongoose = require("mongoose");
const multer = require("multer");
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
        res.render("index", { allData: allData });
      });
    });
  });
};

exports.gallery = async (req, res) => {
  await product().then(() => {
    res.render("gallery", { data1: data });
  });
};

exports.register = async (req, res) => {
  res.render("Register");
};

exports.addbanner = async (req, res) => {
  res.render("addbanner");
};

exports.addslider = async (req, res) => {
  res.render("addslider");
};

exports.productform = async (req, res) => {
  res.render("productform");
};

exports.MessageSending = async (req, res) => {
  await Message.find().then((msg) => {
    console.log(msg);
    res.render("Message-sending", { msg });
  });
};

exports.otp = async (req, res) => {
  res.render("otp");
};

exports.scan = async (req, res) => {
  res.render("scan");
};

exports.back = async (req, res) => {
  res.redirect("/login/Admin/Message-sending");
};

const storage = multer.diskStorage({
  destination: "./../public/uploads",
  filename: async (req, file, cb) => {
    let newImagePath;
    newImagePath = Date.now() + path.extname(file.originalname);
    cb(null, newImagePath);
  },
});
const upload = multer({ storage: storage }).single("upload");
exports.gallerySave = async (req, res) => {
  upload(req, res, async (err) => {
    const gallery_data = await new Gallery({
      Product_name: req.body.Product_name,
      Product_price: req.body.Product_price,
      Category: req.body.Category,
      Product_Desc: req.body.Product_Desc,
      Product_img: req.file.filename,
    });
    gallery_data
      .save()
      .then((result) => {
        //REDIRECTING TO PRODUCT FORM PAGE
        product();
        res.redirect("/login/Admin/productform");
      })
      .catch((err) => console.log(err));
  });
};

let userData = new Object();
exports.registerSave = async (req, res) => {
  const customer_data = new Customer(req.body);

  userData.First_name = customer_data.First_name;
  userData.Phone_number = customer_data.Phone_number;
  userData.DOB = customer_data.DOB;
  const user_number = new DOB_number(userData);
  user_number
    .save()
    .then((result) => {
      console.log("saved");
    })
    .catch((err) => console.log(err));

  customer_data
    .save()
    .then((result) => {
      //REDIRECTING TO REGISTRATION PAGE
      res.redirect("/login/Admin/register");
    })
    .catch((err) => console.log(err));
};

exports.addbannerSave = async (req, res) => {
  upload(req, res, async (err) => {
    const Banner_img = await new Banner({
      Banner_img: req.file.filename,
    });
    data.Banner_img = req.file.filename;
    Banner_img.save()
      .then((result) => {
        //REDIRECTING TO PRODUCT FORM PAGE
        //product();
        res.redirect("/addbanner");
      })
      .catch((err) => console.log(err));
  });
};

exports.addsliderSave = async (req, res) => {
  upload(req, res, async (err) => {
    const slider_img = await new Slider({
      Slider_img: req.file.filename,
    });
    // data.Slider_img = req.file.filename;
    slider_img
      .save()
      .then((result) => {
        //REDIRECTING TO PRODUCT FORM PAGE
        //product();
        res.redirect("/addslider");
      })
      .catch((err) => console.log(err));
  });
};

exports.gallerydelete = async (req, res) => {
  Gallery.findOneAndDelete({ _id: req.body.id }).then(() => {
    console.log("deleted gallery");
    res.redirect("/gallery");
  });
};

exports.deletebanner = async (req, res) => {
  Banner.findOneAndDelete({ _id: req.body.id }).then(() => {
    console.log("deleted banner");
    res.redirect("/login/Admin");
  });
};

exports.deleteslider = async (req, res) => {
  Slider.findOneAndDelete({ _id: req.body.id }).then(() => {
    console.log("deleted slider");
    res.redirect("/login/Admin");
  });
};

//Discount message sending
const what_message = async (message, res) => {
  await customerData.find().then((customerData) => {
    client = new Client();
    client.on("qr", (qr) => {
      QRCode.toDataURL(qr, { small: true }, (err, qr) => {
        if (err) {
          console.log(err);
        } else {
          res.render("scan", { qr: qr });
        }
      });
    });
    client.on("ready", () => {
      try {
        console.log("Client is ready!");

        for (let i in customerData) {
          //should be done once a day
          console.log(i);
          const number = customerData[i].Phone_number;
          const chatId = "91" + number + "@c.us";

          let text =
            "Hello " + customerData[i].First_name + ", " + message.message;
          console.log(text);
          client.sendMessage(chatId, text);
          console.log("send");
        }
      } catch (err) {
        console.log("err");
      }
    });
    client.initialize();
  });
};
exports.Messagediscount = async (req, res) => {
  if (req.body.message) {
    await Message.findByIdAndUpdate(
      { _id: "6356aa6d5650dc11e99305c6" },
      { $set: { message: req.body.message } }
    ).then(() => {
      what_message(req.body, res);
    });
  } else {
    await Message.find().then((msg) => {
      if (msg[0]) {
        what_message(msg[0], res);
      } else {
        const msg = new Message({
          type: "Message",
          message: req.body.message,
        });
        what_message(msg, res);

        msg
          .save()
          .then((result) => {
            //REDIRECTING TO MESSAGE SENDING FORM PAGE
            //res.redirect("/Message-sending");
          })
          .catch((err) => console.log(err));
      }
    });
  }
};

//birthday message sending
const birth_msg = async (msg, res) => {
  await customerData.find().then((customerData) => {
    const client = new Client();
    client.on("qr", (qr) => {
      //console.log('QR RECEIVED', qr);
      QRCode.toDataURL(qr, { small: true }, (err, qr) => {
        if (err) {
          console.log(err);
        } else {
          res.render("scan", { qr: qr });
        }
      });
      // qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("Client is ready!");

      let currentDate = new Date();
      let cDay = currentDate.getDate();
      let cMonth = currentDate.getMonth() + 1;

      for (let i in customerData) {
        //should be done once a day

        let date = new Date(customerData[i].DOB);
        let Day = date.getDate();
        let month = date.getMonth() + 1;
        const number = customerData[i].Phone_number;
        const chatId = "91" + number + "@c.us";

        if (month === cMonth && Day === cDay) {
          let text =
            "Hello " +
            customerData[i].First_name +
            ", Happy Birthday " +
            msg.message;
          client.sendMessage(chatId, text);
        } else if (month === cMonth && Day === cDay + 7) {
          let text =
            "Hello " +
            customerData[i].First_name +
            ", " +
            "Your Birthday is coming Next Week, " +
            msg.message;
          client.sendMessage(chatId, text);
        }
      }
    });

    client.initialize();
  });
};
const birth = async (res) => {
  await Message.findById({ _id: "63577333eef14190b39aa210" }).then(
    async (msg1) => {
      birth_msg(msg1, res);
    }
  );
};
exports.MessageBirthday = async (req, res) => {
  if (req.body.message) {
    await Message.findByIdAndUpdate(
      { _id: "63577333eef14190b39aa210" },
      { $set: { message: req.body.message } }
    ).then(() => {
      birth_msg(req.body, res);
    });
  } else {
    await Message.find().then((msg) => {
      if (msg) {
        birth(res);
        // res.redirect("/Message-sending");
      } else {
        const msg = new Message({
          type: "Birthday_msg",
          message: req.body.message,
        });
        birth(res);
        msg
          .save()
          .then((result) => {
            //REDIRECTING TO MESSAGE SENDING FORM PAGE
            //  res.redirect("/Message-sending");
          })
          .catch((err) => console.log(err));
      }
    });
  }
};
