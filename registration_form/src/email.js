const { googleapis, google } = require("googleapis");
const { oauth2 } = require("googleapis/build/src/apis/oauth2");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const Oauth2client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
Oauth2client.setCredentials({ refresh_token: REFRESH_TOKEN });
// const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false ,alphabets:false})

async function sendMail(mailOptions) {
  try {
    const accessToken = await Oauth2client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "oauth2",
        user: "kaushikgangani940906@gmail.com",   
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    // const mailOpations = {
    //     from : 'gangani  <kaushikgangani940906@gmail.com>',
    //     to:'pradip.realloc@gmail.com',
    //     subject:"about mail sending",
    //     text:` your otp is ${otp}`
    // }
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
// sendMail().then((result) => {
//     console.log('Email sent...' , result)
// }).catch((error) => {
//     console.log(error.message)
// })
module.exports = { sendMail };
