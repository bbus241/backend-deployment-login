const User = require("../user/User")
const connectDB = require('../dbConn');
connectDB();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Token = require('../user/token');
const verifymail = require('./sendverifymail');
const crypto = require("crypto")

const CheckUser = async (req,res) => {
    const {usermail, pwd} = req.body;
    if( !usermail || !pwd) return res.status(400).json({'message' : 'Usernme and Password are required. '});
    const founder = await User.findOne({
        $or: [
          { Username: { $regex: new RegExp(`^${usermail}$`, 'i') } },
          { Email: { $regex: new RegExp(`^${usermail}$`, 'i') } }
        ]
      });
    if(!founder) return res.status(409).json({'message': 'Email or Username Incorrect'});
    try{
        const matchpwd =  await bcrypt.compare(pwd, founder.password);
        if(!matchpwd) return res.status(409).json({'message': 'Password Incorret'});
        else {
            if(founder.verify === false){
                let token = await Token.findOne({Username: founder.Username});
                if(!token){
                    const newToken = await Token.create({
                        'Username': founder.Username,
                        'token' : crypto.randomBytes(32).toString("hex")
                    });
            
                    console.log(newToken);
                    const url = `http://localhost:3000/users/${founder.Username}/verify/${newToken.token}`;
            
                    await verifymail.Verifymail(founder.Email,"Verify Email",url)
                }
                return res.status(400).json({'message': 'An Email sent to your account please verify'});
            } 
            
            const accessToken = jwt.sign(
            {
                "Username" : founder.Username
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '300s'
            }
        )
        res.cookie('jwt',{httpOnly: false,maxAge: 24*60*60*1000});
        res.status(201).json({'success':`${founder.Username} Login Successfully ` ,'accessToken' : accessToken,'UserProfile' : founder} );
        }
    }
    catch (err){
        res.sendStatus(500).json({'message' : "Login Failed"});
    }
}
module.exports = { CheckUser }