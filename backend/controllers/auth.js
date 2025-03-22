const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendmailer");

const { MongoClient } = require('mongodb');

const SECRET_KEY = 'AKoF52vMvHyD4+JlhqFtXGRK1hqpTV+Ca4DMdltbik8='

const MONGO_URI = 'mongodb+srv://dallas:ProPhone2025@phonev2.0zg79.mongodb.net/?retryWrites=true&w=majority&appName=PhoneV2';
const client = new MongoClient(MONGO_URI);
const db = client.db('ProPhone');
const usersCollection = db.collection('users');
const magicloginCollection = db.collection('magiclogin');

const nodemailer = require("nodemailer");



exports.resetpassword = async (req, res) => {
  const { email, password } = req.body;


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

   
    await usersCollection.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword} }
  );
  
    await magicloginCollection.deleteOne({ email });
    return res.send("1")

};


exports.verifycode = async (req, res) => {
  const { email, code,register } = req.body;


    const magicEntry = await magicloginCollection.findOne({ email });
    if (!magicEntry || magicEntry.code !== parseInt(code)) {
      return res.send("2"); 
    }

    const user = await usersCollection.findOne({ email });
   


    await magicloginCollection.deleteOne({ email });
    if(!register){
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.json({  token:token });

    }else{
      return res.send("1"); 

    }

};



exports.sendMagicCode = async (req, res) => {
  const { email ,forget } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await usersCollection.findOne({ email });
    await magicloginCollection.deleteOne({ email });

      if (!user) {
          return res.send("2");  
      }else{
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_HOST_USER, 
            pass: process.env.EMAIL_HOST_PASSWORD, 
          },
        });
        const magicCode = Math.floor(100000 + Math.random() * 900000);
        if(forget){
          const mailOptions = {
            from: process.env.EMAIL_HOST_USER,
            to: email,
            subject: "Forget Password",
            text: `Your 6 Digit Code is: ${magicCode}`,
          };
          await transporter.sendMail(mailOptions);
        }else{
          const mailOptions = {
            from: process.env.EMAIL_HOST_USER,
            to: email,
            subject: "Magic Code",
            text: `Your Magic Code is: ${magicCode}`,
          };
          await transporter.sendMail(mailOptions);
        }
       
    
        
        await magicloginCollection.updateOne(
          { email },
          { $set: { code: magicCode } }, 
          { upsert: true } 
      );
        return res.send("1");
      }
    
  } catch (error) {
    console.log(error);
    return res.send("1");
  }
};

exports.forgetpassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const user = await usersCollection.findOne({ email });
  await magicloginCollection.deleteOne({ email });

    if (!user) {
        return res.send("2");  
    }else{
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_HOST_USER, 
          pass: process.env.EMAIL_HOST_PASSWORD, 
        },
      });
      const magicCode = Math.floor(100000 + Math.random() * 900000);
      const mailOptions = {
        from: process.env.EMAIL_HOST_USER,
        to: email,
        subject: "Reset Password",
        text: `Your ProPhone Verification Code is: ${magicCode}`,
      };
  
      await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email Sent Successfully" });

    }
  
};



exports.registeruser = async (req, res) => {
  const { data, plan } = req.body; 
  if (!data) {
    return res.status(400).json({ message: "Invalid request format" });
  }

  const { email, password, firstName, lastName } = data;

  if (!email || !password || !firstName || !lastName || !plan) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    email,
    password: hashedPassword,
    firstname: firstName,
    lastname: lastName,
    plan,
    createdAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);

      return res.send("1"); 
  
      
    
  
  
};



exports.register = async (req, res) => {
  const { email, password,firstName,lastName } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


 

    const user = await usersCollection.findOne({ email });
  
      if (user) {
          return res.send("2");  
      }else{
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_HOST_USER, 
            pass: process.env.EMAIL_HOST_PASSWORD, 
          },
        });
        const verificationcode = Math.floor(100000 + Math.random() * 900000);
        const mailOptions = {
          from: process.env.EMAIL_HOST_USER,
          to: email,
          subject: "Veriy Email",
          text: `Your 6 Digit Email Verification Code is: ${verificationcode}`,
        };
    
        await transporter.sendMail(mailOptions);
        await magicloginCollection.updateOne(
          { email },
          { $set: { code: verificationcode } }, 
          { upsert: true } 
      );
      return res.send("1"); 
  
      }
    
  
  
};

exports.login = async (req, res) => {
  const { email, password, mobile, fcmtoken } = req.body;
  console.log(req.body)
  try {
    if (email === 'dallas@prophone.io' && password === 'owner') {
      const token = jwt.sign({ user_id: 1 }, SECRET_KEY, { expiresIn: '1h' });

      const ownerData = {

        token: token,
        name: 'Dallas Reynolds',
        email: 'dallas@prophone.io',
        role: 'owner',
        avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png'
      };
      return res.json({ownerData });
      // return res.send(ownerData);
      // login(ownerData);
    }
    try {
      

      // Admin Login
      // if (email === "admin@admin.com" && password === "admin@786") {
      //     // if (mobile) {
      //     //     if (fcmtoken) {
      //     //         await usersCollection.findOneAndUpdate(
      //     //             { email },
      //     //             { $set: { fcm_token: fcmtoken, logout: 0 } }
      //     //         );
      //     //     }
      //     //     return res.json({ id: "1" });
      //     // }
      //     return res.json({ id: "1" });
      // }

      const user = await usersCollection.findOne({ email });
      if (!user) {
          return res.send("0");  
      }

      if (user.googleauth === 1) {
          if (user.suspened === 1) {
              return res.json({ reason: user.reason });
          } else if (user.subscribed === 1) {
              if (fcmtoken) {
                  await usersCollection.findOneAndUpdate(
                      { email },
                      { $set: { fcm_token: fcmtoken, logout: 0 } }
                  );
              }

             
              const token = jwt.sign({ user_id: user.id }, SECRET_KEY, { expiresIn: '1h' });
              const ownerData = {

                token: token,
                name: user.firstname+ ' ' + user.lastname,
                email: user.email,
                role: 'user',
                avatar: user.avater
              };
              return res.json({ownerData }); 
              // return res.json({ id: user.id, token });
          } else {
              return res.send("0"); 
          }
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
          if (user.suspened === 1) {
              return res.json({ reason: user.reason });
          } else if (user.subscribed === 1) {
              if (fcmtoken) {
                  await usersCollection.findOneAndUpdate(
                      { email },
                      { $set: { fcm_token: fcmtoken, logout: 0 } }
                  );
              }

              const token = jwt.sign({ user_id: user.id }, SECRET_KEY, { expiresIn: '1h' });
              const ownerData = {

                token: token,
                name: user.firstname + ' '+ user.lastname,
                email: user.email,
                role: 'user',
                avatar: user.avater
              };   
              return res.json({ownerData }); 
              // return res.json({ id: user.id, token });
          }
      } else {
          return res.send("2"); 
      }

  } catch (err) {
      res.status(500).json({ message: err.message });
  }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
