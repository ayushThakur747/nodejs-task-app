const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('../task/task')
//user

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){//using validator library to validate our email
                throw new Error('Email is invalid');
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){// this is how we make our own custom validation for a field in a document
            if(value<0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,//trim all the spaces
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password contain "password"')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true, //mongo will take care of the time when the data is created and when it is last updated
})
userSchema.virtual('tasks',{ //referrence to relational Task model 
    ref: 'Task',
    localField:'_id', //related with (User)
    foreignField: 'owner', //related to(Task)
})


//defining new method for mongodb query, static methods are availabe on models also known as model method
userSchema.statics.findByCredentials = async(email, password)=>{ 
    
    const user = await User.findOne({email});
    if(!user){
        return user.error = 'unable to login';
    } 
    
    const isMatch = await bcrypt.compare(password,user.password);
    
    if(!isMatch){
        return user.error = 'unable to login';
    } 
    return user;
}

userSchema.methods.generateAuthToken = async function(){ // methods are also avail on instance  
    const user = this;
    const token = jwt.sign({_id:user._id.toString()},'secret');
    
    user.tokens = user.tokens.concat({token:token});
    await user.save();

    return token;
}
//userSchema.methods.getPublicProfile = async function(){ //this fn is for the purpose to hide all the secret details before responding to client side
    userSchema.methods.toJSON = async function(){    
    const user =this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

//middleware(before), hash the password before query
userSchema.pre('save',async function(next){ //will run at every save command
    const user = this; //this is her document which we are saving in db,here the user document
    console.log("here*");
    if(user.isModified('password')){ //if the password field is modified, or the user is just created 
        user.password = await bcrypt.hash(user.password,8);
    }
    
    next();//it is to say that the code is done here 
})
//middleware for deleting the user's  task when user is removed
userSchema.pre('remove', async function(next){//will run at remove command/query
    const user = this;
    await Task.deleteMany({owner:user._id});

    next();
})


const User = mongoose.model('User',userSchema)

module.exports = User;