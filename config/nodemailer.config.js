import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("Email service not connected", error);
  } else {
    console.log("Email service connected successfully");
  }
});
export default transporter;
