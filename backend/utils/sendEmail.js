const nodeMailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth:{
      user:"sandip.191724@ncit.edu.np",
      pass:"NCIT_12345#"
    },
  });

  const mailOptions = {
    from:"sandip.191724@ncit.edu.np",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail
