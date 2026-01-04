const mongoose =require('mongoose');


const ProfileSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    Bio:{
        type:String,
        maxLength:150
    },
    avatarUrl:{
        type:String,
    },
    mobilenumber:{
        type:String,
        match:[/^\d{10}$/,"Please enter valid 10 digit mobile number"]
    },
    address:{
        type:String,
        maxLength:200
    },
    country:{
        type:String,
    },
    DoB:{
        type:Date,
   },
   TravelPreferences:{
    type:[String]
   },
   Transport:{
    type:[String]
   },
},{ timestamps:true})

module.exports = mongoose.model('Profile',ProfileSchema);