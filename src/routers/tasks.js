const express = require('express');
const Task = require('../models/task/task');
const auth = require('../middleware/auth');
const router = new express.Router();

//add a task
router.post('/tasks',auth,async(req,res)=>{
    const task = new Task({
        ...req.body,
        owner:req.user._id
    });
    try {
        const tasksaved = await task.save();
        res.status(200).send(tasksaved);
        
    } catch (error) {
        res.status(200).send(error);
    }
    // task.save().then(()=>{
    //     res.status(200).send(task);
    // }).catch((error)=>{
    //     res.status(200).send(error);
    // })
})
//get all tasks(/tasks?completed=true/false)
//for pagination (?limit=...&skip=...)
//for sort (ex: ?sortBy=createdAt:desc (asc for ascending desc for decending))
router.get('/tasks', auth,async (req,res)=>{
    const match = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true' //will return boolean true or false 
    }
    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':'); //createdAt:desc (this query string will split by :  ) 
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    

    try {
        //const tasks = await Task.find({owner: req.user._id});
        await req.user.populate({//
            path:'tasks', 
            match:match,//for filter
            option:{ //for pagination
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:sort, //for sorting, sort is a object like {createdAt: 1 or -1}
            }
        }).execPopulate()
        res.send(req.user.tasks); 
    } catch (error) {
        res.status(500).send(error);
    }

    // Task.find({}).then((tasks)=>{
    //     res.send(tasks);
    // }).catch((err)=>{
    //     res.status(500).send(err);
    // })
})
// get task by id
router.get('/tasks/:id',auth,async(req,res)=>{

    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
    } catch (error) {
        res.status(500).send(error);
    }

    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send();
    //     }
    //     res.send(task);
    // }).catch((err)=>{
    //     res.status(500).send();
    // })

})
//update a task by id
router.patch('/tasks/:id', auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update)=>{
        allowedUpdates.includes(update);
    })
    if(isValidOperation) return res.status(404).send({error:'Invalid updates'})

    try {
        const task = await Task.findById({_id: req.params.id, owner: req.user._id});
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
        if(!task){
            return res.status(404).send();
        }
        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();
        
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})   
//delete a task
router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        res.status(500).send(error);
    }
})

module.exports = router;