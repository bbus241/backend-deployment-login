const User = require("../user/User")
const connectDB = require('../dbConn');
connectDB();
const bcrypt = require('bcrypt');
const BSON = require('bson');

const editUser = async (req,res) => {
   
    const {user, email,pwd , pic} = req.body; 
    if( !user || !pwd) return res.status(400).json({'message' : 'Username and Password are required. '});
    const founder = await User.findOne({ Email: { $regex: new RegExp(`^${email}$`, 'i') } });
    const founder_username = await User.findOne({ Username: { $regex: new RegExp(`^${user}$`, 'i') } });
    if(founder_username && founder_username.Username !== founder.Username) {
        return res.status(409).json({'message': 'Username is duplicated'})
    }
    try{
        const matchpwd =  await bcrypt.compare(pwd, founder.password);
        if(!matchpwd) return res.status(409).json({'message': 'Password Incorret'});
        else {
          founder.Username = user;
          founder.pic = pic;
          await founder.save();
          res.status(201).json({'success':`Edit Profile Successfully` ,'profile' : founder} );
        }
    }
    catch (err){
        res.sendStatus(500).json({'message' : "Edit Profile Failed"});
    }
}
module.exports = { editUser }