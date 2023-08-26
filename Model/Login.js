const mongoose = require('mongoose');

const userSchemaVerification = new mongoose.Schema({
  userId :{ String},
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
},
{
    collection: 'Login'
});

const Login = mongoose.model('Login', userSchemaVerification);
module.exports = Login;
