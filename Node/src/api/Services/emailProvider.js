const API_KEY = 'c54556a333718b6195eb55bc118d2c5e-0be3b63b-484169ee';
const DOMAIN = 'sandboxae47135174fc48ceab56e91199c50502.mailgun.org';

const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});



exports.send=(to,from,subject,text)=>
{
    const messageData = {
        from: from, // 'Adamas Store <arslankhanvision@gmail.com>',
        to:to,// 'arslankhanvision@gmail.com',
        subject:subject,// 'Transaction Details from adamas store',
        text: text,//'Here is the amount $$$ which is deduced from your account'
    };
    mg.messages().send(messageData, function (error, body) {
        console.log(body);
    });
}