const express = require('express');
const Task = require('../models/task/task');

const router = new express.Router();

//add a task
router.post('/tasks',async(req,res)=>{
    const task = new Task(req.body);
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
//get all tasks
router.get('/tasks',async (req,res)=>{
    console.log("here");
    try {
        const tasks = await Task.find({});
        res.send(tasks); 
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
router.get('/tasks/:id',async(req,res)=>{

    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
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
router.patch('/tasks/:id',async(req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update)=>{
        allowedUpdates.includes(update);
    })
    if(isValidOperation) return res.status(404).send({error:'Invalid updates'})

    try {
        const task = await Task.findById(req.params.id);
        updates.forEach((update)=> task[update] = req.body[update]);
        await task.save();
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})   
//delete a task
router.delete('/tasks/:id',async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(error){
        res.status(500).send(error);
    }
})

module.exports = router;