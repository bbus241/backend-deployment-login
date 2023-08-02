const User = require("../user/User")
const connectDB = require('../dbConn');
connectDB();
const bcrypt = require('bcrypt');
const Token = require('../user/token');
const verifymail = require('./sendverifymail');
const crypto = require("crypto")

const newUser = async (req,res) => {
    const {user,email, pwd} = req.body;
    if( !user || !pwd) return res.status(400).json({'message' : 'Usernme and Password are required. '});

    const duplicate_user = await User.findOne({Username: { $regex: new RegExp(`^${user}$`, 'i') }});
    const duplicate_email = await User.findOne({Email: { $regex: new RegExp(`^${email}$`, 'i') }});
    if(duplicate_user) return res.status(409).json({'message': 'duplicate username'});
    if(duplicate_email) return res.status(409).json({'message': 'duplicate email'});
    try{
        const hashedPwd =  await bcrypt.hash(pwd, parseInt(user));
        const result = await User.create({ 
            'Username': user,
            'Email': email,
            'password': hashedPwd,
        });
        const newToken = await Token.create({
            'Username': user,
            'token' : crypto.randomBytes(32).toString("hex")
        });

        console.log(newToken);
        const url = `http://localhost:3000/users/${user}/verify/${newToken.token}`;

        await verifymail.Verifymail(email,"Verify Email",url)
        res.status(201).send({message:"An Email sent to your account please verify"})
    }
    catch (err){
        console.log(err);
        res.status(500).json({'message' : err.message});
    }
}
module.exports = { newUser }