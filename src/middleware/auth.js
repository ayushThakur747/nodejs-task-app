const jwt = require('jsonwebtoken');
const User = require('../models/user/user');
const auth = async(req, res, next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer','') //to get token from the header comming from client side
        const decoded = jwt.verify(token,'secret');
        const user = await User.findOne({_id:decoded._id,'tokens.token':token});

        if(!user){
            throw new Error();
        }
        req.user = user;
        next();
    }catch(err){
        res.status(401).send({error:'authentication required'})
    }
}

module.exports = auth;