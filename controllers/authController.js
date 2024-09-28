const User = require('../models/User');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');

const signup = async (req, res)=>{
    try {
        const existingUser = await user.findOne({email : req.body.email});
        if(existingUser) return res.status(400).send("Email already exists");

        //using bcrypt to hash the password with salt value of 10
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        // creating the new user
        const newUser = new user({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        });

        await newUser.save();
        res.status(201).send("Signup successfully");
    } catch(err){
        res.status(500).send("Internal server error");
    }
};

const login = async (req, res)=>{
    try {
        const userProvided = await user.findOne({email : req.body.email});
        if(!userProvided) return res.status(401).send("Invalid credentials"); 

        //comparing password
        const passwordMatch = bcryptjs.compare( req.body.password , userProvided.password);
        if(!passwordMatch) return res.status(401).send("Invalid credentials");

        // generating Json web token for further use
        const token = jwt.sign({ email: userProvided.email }, 'pulkits secret',  { expiresIn: '1m' } ); //changed to expire in 1 minute
        res.status(200).json({ token });
    } catch(err){
        res.status(500).send("Internal server error");
    }
};


module.exports = { signup, login };