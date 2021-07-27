const express = require('express');
require('./db/mongoose');
const multer = require('multer');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks');
const auth = require('./middleware/auth');

const app = express();
const port = process.env.PORT || 5000;

app.use((req,res,next)=>{ //middlewares: new request-> do something(middleware) ->run route handeler

})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


//file uploads
// const upload = multer({
//     dest:'images',
//     limits:{
//         fileSize: 1000000 //1mb
//     },
//     fileFilter(req,file,callback){
//         // callback(new Error('File must be a PDF')); //send the error
//         // callback(undefined,true);//when nothing went wrong
//         // callback(undefined,false);//when somthing went wrong but we are not sending error to client and silently rejecting the req

//         //if(!file.originalname.endsWith('.pdf')){// checking a file extension
//         if(!file.originalname.match(/\.(doc|docx)$/)){
//         return callback(new Error('please upload a PDF'));
//         }
//         callback(undefined,true);
//     }
// })

// app.post('/upload',auth,upload.single('upload'),(req,res)=>{
//     res.send();
// },(error,req,res,next)=>{
//     res.status(400).send({error:error.message})
// })
 



app.listen(port,()=>{
    console.log('server runnig on',port);
})
// const main = async ()=>{
//     const user = await User.findById('sdfsd some user id...');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }
// const jwt = require('jsonwebtoken');
// const myFunction = async()=>{
//     const token = jwt.sign({_id:'abcd123'},'secret',{expiresIn:'1h'}); //this creates jwt token with payload data and the secret key, and exprires in param
//     console.log(token);

//     const data = jwt.verify(token,'secret'); //this verify the secret of jwt and returns the payload data from that token
//     console.log(data);
// }
// //myFunction();