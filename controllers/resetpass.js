const User = require("../user/User")
const connectDB = require('../dbConn');
connectDB();
const bcrypt = require('bcrypt');

const ResetPass = async (req,res) => {
    const {user,email, pwd} = req.body;
    if(!pwd) return res.status(400).json({'message' : 'Usernme and Password are required. '});

    const founder = await User.findOne({
        $and: [
          { Username: { $regex: new RegExp(`^${user}$`, 'i') } },
          { Email: { $regex: new RegExp(`^${email}$`, 'i') } }
        ]
      });

    if(!founder) return res.status(409).json({'message': 'Incorrect Email or Username'});
    try{
        const hashedPwd =  await bcrypt.hash(pwd, parseInt(user));
        founder.password = hashedPwd;
        const result = await founder.save();
        res.status(201).json({'success':`Reset Password ${user} Successfully`})
    }
    catch (err){
        res.sendStatus(500).json({'message' : err.message});
    }
}
module.exports = { ResetPass }