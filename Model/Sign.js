const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  
},
{
    collection: 'SignUp'
});

const SignUp = mongoose.model('SignUp', userSchema);

module.exports = SignUp;
