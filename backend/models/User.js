const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
      type:String,
      required:true,
      trim:true
    },
    email:{
        type:String,
        required:true,
         unique:true,
         trim:true,
         match:[/.+\@.+|..+/,"Please enter valid email address"],
    },
    password:{
            type:String,
            required:true,
            minlength:8
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }},
    { timestamps:true },
)

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

//Match user entered password to hash password

userSchema.methods.matchPassword =  async function (enterpassword) {
    return await bcrypt.compare(enterpassword,this.password)
}

module.exports= mongoose.model('User', userSchema);
