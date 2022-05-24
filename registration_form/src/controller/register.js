const Register = require("../models/registration");
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const bodyParser = require("body-parser");
const auth = require("../middleware/auth");
const mail = require("../email");
exports.register = async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    //100000 + Math.floor(Math.random() * 900000);
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    const otptime = new Date();
    if (password != confirmpassword) {
      return res.status(401).send("password is not matched");
    }
    const registrationEmployee = new Register({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      age: req.body.age,
      password: password,
      confirmpassword: confirmpassword,
      otp: otp,
      otptime: otptime,
    });
    const token = await registrationEmployee.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    console.log(` regi  ${req.cookies.jwt}`);
    const registrered = await registrationEmployee.save();
    res.status(201).send(registrered);
    console.log(registrered);
    const email = req.body.email;

    const mailOpations = {
      from: "gangani  <kaushikgangani940906@gmail.com>",
      to: email,
      subject: "about mail sending",
      text: " your otp is " + otp,
    };
    mail.sendMail(mailOpations);
  } catch (e) {
    //res.status(400).send(e);
    res.status(401).send(e);
  }
};

exports.verifyotp = async (req, res) => {
  try {
    const email = await Register.findOne({
      email: req.body.email,
    });
    if (email == null) {
      return res.send("please enter valid register email");
    }
    const currentOtptime = new Date();
    const differenceTime = (currentOtptime - email.otptime) / 60000;
    console.log(differenceTime);
    //console.log(email);
    if (differenceTime < 2) {
      if (email.otp == req.body.otp) {
        const updateOtp = await Register.findOneAndUpdate(
          { email: req.body.email },
          { $set: { otp: null, verified: true } }
        );
        res.send(updateOtp);
      } else {
        // console.log("otp is not match");
        res.status(401).send("otp is not match");
      }
    } else {
      res.status(401).send("your otp is expire");
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

exports.resendotp = async (req, res) => {
  try {
    const email = await Register.findOne({
      email: req.body.email,
    });
    if (!email) {
      return res.send("please enter valid register email");
    }
    const newOtp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    const NewOtpTime = new Date();
    const newUpdateOtp = await Register.findOneAndUpdate(
      { email: req.body.email },
      { $set: { otp: newOtp, otptime: NewOtpTime } }
    );
    const mailOpations = {
      from: "gangani <kaushikgangani940906@gmail.com>",
      to: req.body.email,
      subject: "about mail sending",
      text: "your otp is " + newOtp,
    };
    mail.sendMail(mailOpations);
    res.send(newUpdateOtp);
  } catch (error) {
    console.log(error);
  }
};


exports.login = async (req, res) => {
  try {
    const user = await Register.findOne({ email: req.body.email });
    if (user.verified != true) {
      return res.send(" your otp is not verified");
    }
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({ email });
    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });

    // console.log(` this is cookie + ${req.cookies.jwt}`);

    if (isMatch) {
      res.status(201).send("log in success");
    } else {
      res.status(401).send("invalid login details");
    }
  } catch (error) {
    res.status(400).send("invalid login details");
  }
};

exports.forgotpasswordotp = async (req, res) => {
  try {
    const user = await Register.findOne({ email: req.body.email });
    if (user == null) {
      return res.status(401).send("user is not found");
    }
    const fotp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    const fotptime = new Date();
    const Updatefotp = await Register.findOneAndUpdate(
      { email: req.body.email },
      { $set: { fotp: fotp, fotptime: fotptime, fverified: false } }
    );
    console.log("fdsdfds")
    const mailOpations = {
      from: "gangani <kaushikgangani940906@gmail.com>",
      to: req.body.email,
      subject: "about mail sending",
      text: " your resend otp is" + fotp,
    };
    mail.sendMail(mailOpations);
    res.send(Updatefotp);

  } catch (error) {
    res.status(401).send({
      status: true,
      message: "password not forget",
    });
  }
  //   res.status(401).send
  //   {
  //     ("your password is not forgot")
  // }
};

exports.forgotverifyotp = async (req, res) => {
  try {
    const email = await Register.findOne({
      email: req.body.email,
    });
    console.log(email);
    if (email == null) {
      return res.send("please enter valid register email");
    }
    const currentOtptime = new Date();
    console.log(email.fotptime);
    const differenceTime = (currentOtptime - email.fotptime) / 60000;
    console.log(differenceTime);
    //console.log(email);
    if (differenceTime < 2) {
      if (email.fotp == req.body.fotp) {
        const fupdateOtp = await Register.findOneAndUpdate(
          { email: req.body.email },
          { $set: { fotp: null, fverified: true } }
        );
        res.send(fupdateOtp);
      } else {
        // console.log("otp is not match");
        res.status(401).send("fotp is not match");
      }
    } else {
      res.status(401).send("your fotp is expire ");
    }
  } catch (error) {
    res.status(401).send(error);
  }
};

exports.fresendotp = async (req, res) => {
  try {
    const email = await Register.findOne({
      email: req.body.email,
    });
    if (email == null) {
      return res.send("please enter valid register email");
    }
    const newfOtp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
      alphabets: false,
    });
    const NewfOtpTime = new Date();
    const UpdatefOtp = await Register.findOneAndUpdate(
      { email: req.body.email },
      { $set: { fotp: newfOtp, fotptime: NewfOtpTime } }
    );
    const mailOpations = {
      from: "gangani <kaushikgangani940906@gmail.com>",
      to: req.body.email,
      subject: "about mail sending",
      text: " your resend otp is " + newfOtp,
    };
    mail.sendMail(mailOpations);
    res.send(UpdatefOtp);
  } catch (error) {
    console.log(error);
  }
};

exports.changepassword = async (req, res) => {
  try {
    const email = await Register.findOne({
      email: req.body.email,
    });
    if (email == null) {
      return res.send("please enter valid register email");
    }
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    if (password == confirmpassword) {
      password = await bcrypt.hash(password, 10);
      confirmpassword = await bcrypt.hash(confirmpassword, 10);
      const changePassword = await Register.findOneAndUpdate(
        { email: req.body.email },
        { $set: { password: password, confirmpassword: confirmpassword } }
      );
      res.send(changePassword);
    } else {
      res.status(401).send("password is not match...");
    }
  } catch (error) {
    console.log(error);
    res.status(401).send(error);
  }
};

exports.logout = async (req, res) => {
  try {
    console.log(req.user);
    req.user.token = [];
    res.clearCookie("jwt");
    console.log("logout successfully .. ");
    await req.user.save();
    res.send("logout successfully ..");
  } catch (error) {
    res.status(500).send(error);
  }
};
// const mailgun = require("mailgun-js");
// const DOMAIN = 'YOUR_DOMAIN_NAME';
// const mg = mailgun({apiKey: "50c75b1104b9d49c2d0807bdc482e824", domain:"sandbox7.mailgun.org"});
// const data = {
// 	from: '<kaushikgangani940906@gmail.com>',
// 	to: 'shweta.realloc@gmail.com',
// 	subject: 'Hello',
// 	text: 'Testing some Mailgun awesomness!'
// };
// mg.messages().send(data, function (error : any, body : any) {
// 	console.log(body);
// });
