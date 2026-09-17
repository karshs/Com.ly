const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs');

const userSchema = new mongoose.Schema(

    {
        username :{
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
            minlength : [3, 'Username must be at least 3 characters'],
            maxlength : [30, 'Username must be at most 30 characters'],
            match : [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'],
        },

        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true,
            match : [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],

        },

        password: {
            type: String,
            required: true,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        verificationToken: {
            type : String,
            default : null,
        },

        resetPasswordToken : {
            type : String,
            default : null,
        },

        resetPasswordExpires : {
            type : Date,
            default : null,
        },

        refreshToken : {
            type : String,
            default : null,
        },


    },

    {
        timestamps : true,
    }




);

userSchema.pre('save' , async function (){
    if(!this.isModified('password')){
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
        
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
