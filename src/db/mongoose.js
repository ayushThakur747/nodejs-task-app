const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const mongoURL = process.env.MONGODB_URL || 'mongodb://localhost/tasksdb';
mongoose.connect(mongoURL,{

        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    
})

