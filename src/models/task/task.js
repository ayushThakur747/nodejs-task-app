const mongoose = require('mongoose');
const validator = require('validator');
//task

const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' //to create relationship with User model
    }
},{
    timestamps:true,
})



const Task = mongoose.model('Task',taskSchema)
module.exports = Task;
