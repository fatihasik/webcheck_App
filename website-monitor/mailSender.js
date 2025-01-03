const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, 
  secure: false,
  auth: {
    user: 'webstatsmailsender@gmail.com',
    pass: 'qhvk ntye rgck nybs'
  }
});

const sendEmailNotification = async (site) => {
  const mailOptions = {
    from: 'webstatsmailsender@gmail.com',
    to: 'fth.asik@gmail.com', 
    subject: `Web Sitesi Kesinti Uyarısı: ${site.name}`,
    text: `Web sitesine: ${site.name} (${site.url}) şu anda erişim bulunmamakta.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`${site.name} için e-posta gönderildi.`);
  } catch (error) {
    console.error('E-posta gönderim hatası:', error);
  }
};

module.exports = { sendEmailNotification };
