const mongoose = require('mongoose');

//db connection
mongoose.connect('mongodb://localhost/tasksdb',{

        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    
})

