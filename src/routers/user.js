const express = require('express');
const User = require('../models/user/user');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer'); //for file uploads
const sharp = require('sharp'); //helps us to set the type of image and resizing image
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

//file uploads
const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error('Please upload an image'));
        }
        callback(undefined,true);
    }
})
//upload a avatar
router.post('/users/me/avatar',upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).png.toBuffer(); //convert image to png using sharp and getting back png buffer
    
    
    req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
},(error,req,res,next)=>{//handle error
    res.send({error: error.message})
})

//delete avatar
router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})
//fetching an avatar
router.get('/users/:id/avatar',async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar){
            throw new Error();
        }
        res.set('Content-Type','image/jpg');//has to set for jpg
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send();
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