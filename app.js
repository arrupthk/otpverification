const express = require('express'); 
// framework to build web apis. simplifies process of creating http req, res and middlewares
const bodyParser = require('body-parser');
//middleware for parsing req body in JSON format
const path = require('path');
//provides utilities for working with file paths, helps you manipulate file path, independent of operating system.
const app = express();
//instance used to configure routes, handle middleware and manage application; procides set of methods to define routes
const cors = require('cors');
// to define routes- how  web pages from one domain can request resources from other domain
const dotenv = require('dotenv');
dotenv.config();
const { mongoConnect } = require('./database'); 
const SignUp = require('./Model/Sign')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'Views')));


const signUpRouter = require('./Route/sign')
app.use('/user', signUpRouter)
app.use('/send-otp', signUpRouter)
app.use('/verify-otp', signUpRouter)



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'signup.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'login.html'));
  });

  
mongoConnect(() => {
    app.listen(4200, () => {
      console.log('Server is running on port 4200');
    });
  });