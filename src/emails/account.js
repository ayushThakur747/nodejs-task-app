const dotenv = require('dotenv');
const sgMail = require('@sendgrid/mail');

//const sendGridAPIKey="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";//import it from config dev.env

dotenv.config();
const sendGridAPIKey = process.env.SENDGRID_API_KEY ||  "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";
sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail = (email, name)=>{
   
    sgMail.send({
        to:email,
        from:'ayushthakurofficial1@gmail.com',
        subject:'Thanks for joining in!',
        text: `Welcome to the app, ${name}. let me know hoe you get along with the app`
    })
}
const sendCancelationEmail = (email, name)=>{
    sgMail.send({
        to:email,
        from:'ayushthakurofficial1@gmail.com',
        subject:'bye bye!',
        text: `its so sad to see you go, ${name}. `
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
