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

})
router.get('/tasks', auth,async (req,res)=>{
    const match = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true' 
    }
    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':'); 
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    

    try {
   
        await req.user.populate({
            path:'tasks', 
            match:match,
            option:{ 
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort:sort,
            }
        }).execPopulate()
        res.send(req.user.tasks); 
    } catch (error) {
        res.status(500).send(error);
    }
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

})
//update a task by id
router.patch('/tasks/:id', auth,async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update)=>{
        allowedUpdates.includes(update);
    })
    if(!isValidOperation) return res.status(404).send({error:'Invalid updates'})

    try {
        const task = await Task.findById({_id: req.params.id, owner: req.user._id});
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
