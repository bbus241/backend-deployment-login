require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3500;
const mongoose = require('mongoose');
const connectDB = require('./dbConn');
const register = require('./controllers/register')
const login = require('./controllers/login')
const verifyjwt = require('./middleware/verifyjwt');
const cookieparser = require('cookie-parser');
const sendmailer = require('./controllers/sendmailer');
const resetpass = require('./controllers/resetpass');
const getuser = require('./controllers/getUser')
const verifymail = require('./controllers/verifymail');
const edit_profile = require('./controllers/edit')

// connextMongoDB
connectDB();

//
app.use(cors());

app.use(express.urlencoded({extended: false}));
app.use(express.json());


//cookieparser
app.use(cookieparser());

app.post('/register', register.newUser);
app.post('/login', login.CheckUser);
app.post('/sendmailer', sendmailer.send_mail);
app.post('/resetpass', resetpass.ResetPass);
app.post('/edituser',edit_profile.editUser);

// app.use(verifyjwt);
app.get("/getUser",verifyjwt,getuser.getUser);
app.get("/:user/verify/:token",verifymail);
  
mongoose.connection.once('open',()=>{
    console.log('Connected to MongoDB');
    app.listen(PORT, ()=>
    console.log(`Server running on Port ${PORT}`));
})