const User = require("../user/User")
const connectDB = require('../dbConn');
connectDB();
const bcrypt = require('bcrypt');

const getUser = async (req,res) => {
    const user = req.user;
    const founder = await User.findOne({Username: { $regex: new RegExp(`^${user}$`, 'i') }});
    if(founder) return res.json({'dataUser': founder})
}
module.exports = { getUser }