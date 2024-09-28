// requiring important modules for the authentication process
const express = require("express");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

//creating app instance of expresss
const app = express();
const PORT = 3000; //running on PORT 3000

// Setting Express Routers For Readibility
const booksRouter = require('./routes/bookroutes');
app.use('/books', booksRouter);

//connecting to mongo db
const connectDB = require('./config/db');
connectDB();
// doing data modeling of user's details or creating a schema

const user = require('./models/users');

// Parses incoming JSON requests so that get req.body data
app.use(express.json());

//chect get request
app.get('/api', (req, res)=>{
    res.status(201).send("checked");
})

//signup POST route
app.post('/api/signup', async (req, res)=>{
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
});

// Route for Login
app.post('/api/login', async (req, res)=>{
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
});

// route for geting an api when you are authorized user
app.get('/api/get', verifyToken, async (req, res)=>{
    try {
        // Fetched user details using decoded token

        const userProvided = await user.findOne({ email: req.user.email });
        if(!userProvided) return res.status(401).send("Unauthorized");

        res.status(200).json({ username: userProvided.username, email: userProvided.email });
    }catch (err) {
        res.status(500).send("Internal server error");
      }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});