const User = require('../Model/Sign');
const Login = require('../Model/Login');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "smtp.gmail.com", // Updated the service name
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email service:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

// async function signUp(req, res) {
//   const { fname, lname, email, number } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(409).send({ message: "User already exists" });
//     }

//     const user = await User.create({ fname, lname, email, number, verified: false });

//     // Call your sendOtpVerification function here
//     await sendOtpVerification(user._id, user.email, res);

//     return res.status(201).send({
//       message: "User created successfully",
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.status(500).send({ message: "Internal server error, check for error" });
//   }
// }
async function signUp(req, res) {
  const { fname, lname, email, number } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({ fname, lname, email, number, verified: false });

    // Call your sendOtpVerification function here
    await sendOtpVerification(user._id, user.email, res);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: "Internal server error, check for error" });
  }
}



const sendOtpVerification = async (_id, email, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(`Generated OTP: ${otp}`);
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify the email",
      html: `Enter ${otp} to verify email`,
    };

    const otpverification = new Login({
      userId: _id,
      otp: otp,
      expiresAt: Date.now() + 360000,
    });

    await otpverification.save();
    await transporter.sendMail(mailOptions);

    res.json({
      status: "PENDING",
      message: "Verification OTP sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
    console.error('Error:', error);
  }
};


async function login(req, res) {
  const { email, otp } = req.body; 
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or OTP' });
    }

    // Check if the OTP exists in the Login collection
    const otpRecord = await Login.findOne({ userId: user._id, otp });

    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid email or OTP' });
    }

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred during login' });
  }
}

module.exports = { signUp, login };
