const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://kaushik:kaushik8894@cluster0.cgnfk.mongodb.net/students-api1?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('connection is success')
}).catch((error) => {
    console.log('no connection')
})