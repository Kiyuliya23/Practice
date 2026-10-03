
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
   auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.SMTP_USER,
    subject: "Test email",
    text: "Hello from Node.js",
};
  transporter.sendMail(mailOptions, (err, info)=>{
    if(err){
        console.error("Ошибка при отправке письма:", err);
        return;
    }
    console.log("Письмо успешно отправлено:", info.response);
  });