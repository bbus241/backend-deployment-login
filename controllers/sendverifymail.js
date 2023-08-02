const Mailer = require('nodemailer');

const Verifymail = async(email,subject,text)=>{
    try{
    const transportar = Mailer.createTransport({
        service: "gmail",
        auth: {
            user: "6210110713@psu.ac.th",
            pass: "yngwhrnzkxsycqcr"
        }
    });
    await transportar.sendMail({
        from: "6210110713@psu.ac.th",
        to: email,
        subject: subject,
        text: text
    });
        console.log("Email send Successfully");
    }catch(error){
        console.log("Email not send")
        console.log(error)
        return error;
    }
    }
    module.exports = {Verifymail};
