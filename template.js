const MailGen = require('mailgen')
const sgMail = require('@sendgrid/mail')
require('dotenv').config()
const mailGenerator = new MailGen({
  theme: 'salted',
  product: {
    name: 'WebsiteLudo',
    link: 'http://192.168.100.121:8086/',
     logo: 'http://192.168.100.121:8086/rsz_1.png'
  },
})

const email = {
  body: {
    name: 'Ashwani Thakur',
    intro: 'Welcome to WebsiteLudo',
    outro: ['Need help, or have questions?', 'Just reply to this email, we\'d love to help.'],
    
    action: {
      instructions: 'Please click the button below to verify your account',
      button: {
        color: '#33b5e5',
        text: 'Verify account',
        link: '',
      },
    },
  },
}




const emailTemplate = mailGenerator.generate(email);

var email2 = {
    body: {
        dictionary: {
            date: 'June 11th, 2016',
            address: '123 Park Avenue, Miami, Florida'
        }
    }
 };

const emailTemplate2=mailGenerator.generatePlaintext(email2); 
const emailText = mailGenerator.generatePlaintext(email);
require('fs').writeFileSync('preview.html', emailTemplate ,'utf8');


module.exports={emailTemplate,emailText,emailTemplate2,email,mailGenerator};