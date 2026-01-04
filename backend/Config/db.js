const mongoose =require('mongoose');

const connectDb = async()=>{
    try{
        await mongoose.connect(process.env.MONGODD_URI);
        console.log("Mongodb is connected");
    }
    catch(err){
          console.log("Database Connection Failed");
    }
}

module.exports = connectDb;