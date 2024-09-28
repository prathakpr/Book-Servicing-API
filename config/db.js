const mongoose = require("mongoose");

//connecting to mongo db
const connectDB = async ()=> {
mongoose.connect('mongodb://localhost:27017/pulkits_database')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});
};

module.exports = connectDB;
