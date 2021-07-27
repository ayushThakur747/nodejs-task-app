const express = require('express');
const User = require('../models/user/user');
const auth = require('../middleware/auth');
const router = new express.Router();

//add a new user sign-up
router.post('/users', async (req,res)=>{
    console.log("here");
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
                     
        res.send({user,token});
    } catch (error) {
        res.status(500).send(error);
    }

})

//sign-in
router.post('/users/login',async (req,res)=>{
    
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password); //new dynamic method created by us for mongodb query
        if(user.error) res.status(404).send(user.error);
    
        const token = await user.generateAuthToken();
                     
        //res.send({user: user.getPublicProfile(),token});
        res.send({user: user,token});
    } catch (error) {
        res.status(400);
    }
})

//get user me
router.get('/users/me',auth,async(req,res)=>{
    req.send(req.user); //req.user from the middleware auth
})
//logout
router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
    } catch (error) {
        res.status(500).send();
    }
})
router.post('/users/logoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})


// update user
router.patch('/users/me',auth,async(req,res)=>{
    
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password','age'];
    const isValidOperation = updates.every((update)=>{
        allowedUpdates.includes(update);
    })
    if(isValidOperation) return res.status(404).send({error:'Invalid updates'})

    try {
        // const user = await User.findById(req.params.id);
        // updates.forEach((update)=> user[update] = req.body[update]);
        // await user.save();

        // //const user = await User.findByIdAndUpdate(req.params.id, req.body,{new:true,runValidators:true});
        // if(!user){
        //     return res.status(404).send();
        // }
        // res.send(user);
    
        updates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
}) 
//delete a user
router.delete('/users/me',auth,async(req,res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     return res.status(404).send();
        // }
        await req.user.remove();
        res.send(req.user);
    }catch(error){
        res.status(500).send(error);
    }
})

module.exports = router;




// //get all users
// router.get('/users',auth,async(req,res)=>{
//     try {
//        const users = await User.find({})
//        res.send(users);
//     } catch (error) {
//         res.status(500).send(err);
//     }
//     // User.find({}).then((users)=>{
//     //     res.send(users);
//     // }).catch((err)=>{
//     //     res.status(500).send(err);
//     // })
// })

// get user ny id
// router.get('/users/:id',async (req,res)=>{

//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);
//         if(!user){
//             return res.status(404).send();
//         }
//         res.send(user);
//     } catch (error) {
//         res.status(500).send();
//     }
    
//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send();
//     //     }
//     //     res.send(user);
//     // }).catch((err)=>{
//     //     res.status(500).send();
//     // })

// })