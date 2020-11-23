const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "0e868b64f5abfa",
    pass: "0e384b5b007cc5"
  }
});