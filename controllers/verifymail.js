const User = require("../user/User")
const connectDB = require('../dbConn');
connectDB();
const Token = require('../user/token');

const Verifymail = async(req,res)=>{
    try{
        const user = await User.findOne({Username: req.params.user});
        if(!user) return res.status(400).send({ message: "Invalid link"});

        const newToken = await Token.findOne({
            Username: req.params.user,
            token: req.params.token
        });
        if(!newToken) return res.status(400).send({message:"Invalid link"});

        await user.updateOne({Username: req.params.user,verify: true});
        await Token.findByIdAndRemove(newToken._id);
        res.status(200).send({message: "Email verified successfully"})
    }catch(error){
        res.status(500).send({message:"Internal Server Error"});
    }
}
module.exports = Verifymail;