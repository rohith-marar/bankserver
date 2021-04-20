const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/bank_server", { useNewUrlParser: true ,useUnifiedTopology: true})

const User = mongoose.model('User', {
    acno: Number,
    name: String,
    balance: Number,
    password: String
})

module.exports={
    User
}