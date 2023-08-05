const Mailer = require('nodemailer');
const User = require("../user/User")

const send_mail = async(req,res)=>{
    const {usermail} = req.body;
    const founder = await User.findOne({
        $or: [
            { Username: { $regex: new RegExp(`^${usermail}$`, 'i') } },
            { Email: { $regex: new RegExp(`^${usermail}$`, 'i') } }
        ]
    });
    if(!founder) return res.status(409).json({'message': 'Incorrect Email or Username'});
    const transportar = Mailer.createTransport({
        service: "gmail",
        auth: {
            user: "6210110713@psu.ac.th",
            pass: "yngwhrnzkxsycqcr"
        }
    });
    // const url = `http://localhost:3000/resetpass/${founder.Username}/${founder.Email}`;
    const url = `https://buszawebpage.netlify.app/resetpass/${founder.Username}/${founder.Email}`;

    var mailOptions = {
        from: "6210110713@psu.ac.th",
        to: `${founder.Email}`,
        subject: "Link for reset password",
        html: `<div>You can reset password this link <a href=${url}>Here</a>`
    }

    transportar.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        return res.status(201).json({'success': "send Email successfully",'username': founder.Username,'email':founder.Email})
        // console.log(info);
      });
    
    }
    module.exports = {send_mail};
