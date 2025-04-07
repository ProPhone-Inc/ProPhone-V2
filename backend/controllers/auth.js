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
    // const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const token = jwt.sign({ user_id: user._id,email: user.email  }, SECRET_KEY, { expiresIn: '1h' });

      // return res.json({  token:token });



      const ownerData = {

        token: token,
        name: user.firstname+ ' ' + user.lastname,
        email: user.email,
        role: 'user',
        avatar: user.avater
      };
      return res.json({ownerData });
    }else{
      return res.send("1"); 

    }

};



exports.fetchusers = async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.user_id) });
    if (!user) return res.status(404).json({ message: "User not found" });

    
const users = await usersCollection.find().toArray(); // Don't forget .toArray()

const formattedUsers = users.map(u => ({
  id: u._id,
  name: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
  email: u.email,
  plan: u.plan || "free",
  status: u.status || "active",
  role: u.role || "sub_user",
  avatar: u.avatar || "https://via.placeholder.com/150", // Fallback avatar
  joinDate: u.createdAt ? new Date(u.createdAt).toISOString().split("T")[0] : null,
  lastLogin:u.lastLogin  || new Date().toLocaleDateString(), // If you want to use lastLogin from DB, replace here
}));
const rolePriority = {
  "owner": 1,
  "super_admin": 2,
  "sub_user": 3,
  "default": 4
};



const sortedUsers = formattedUsers.sort((a, b) => {
  const roleA = rolePriority[a.role] || rolePriority.default;
  const roleB = rolePriority[b.role] || rolePriority.default;

  if (roleA !== roleB) {
    return roleA - roleB; 
  }

  const dateA = new Date(a.joinDate);
  const dateB = new Date(b.joinDate);
  return dateB - dateA;
});


console.log(sortedUsers)

    // Format createdAt field
    // const formattedUsers = users.map(u => ({
    //   ...u._doc,
    //   createdAt: u.createdAt?.toISOString().split("T")[0] || null
    // }));

    return res.json({ users: sortedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adduser = async (req, res) => {
  const { newUser} = req.body; 

  const { email ,password,role,showAds,firstname,lastname } = newUser;
  const user = await usersCollection.findOne({ email });
  console.log(user)
  if (user) {
    return res.send("2");  
}else{
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    email,
    password: hashedPassword,
    firstname: firstname,
    lastname: lastname,
    plan:"free",
    role,
    showAds,
    createdAt: new Date(),
  };

  const result = await usersCollection.insertOne(newUser);
  return res.send("1");  

}
}


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
exports.activateuser = async (req, res) => {
  const { email, reason } = req.body; 
  await usersCollection.findOneAndUpdate(
    { email },
    {
      $unset: { reason: "" },         // deletes the `reason` field
      $set: { status: "active" }      // sets `status` to "active"
    }
  );
    
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_HOST_USER, 
    pass: process.env.EMAIL_HOST_PASSWORD, 
  },
});
const mailOptions = {
  from: process.env.EMAIL_HOST_USER,
  to: email,
  subject: "Your ProPhone Account Has Been Reactivated",
  text: `Dear User,
    
    Great news! Your ProPhone account has been reactivated. You now have full access to all platform features.
    
    You can log in to your account at any time using your existing credentials.
    
    If you have any questions or need assistance, please don't hesitate to contact our support team at support@prophone.io.
    
    Best regards,
    The ProPhone Team`,
};
await transporter.sendMail(mailOptions);
return res.send("1"); 
}
exports.banuser = async (req, res) => {
  const { email, reason } = req.body; 
  await usersCollection.findOneAndUpdate(
    { email },
    { $set: { reason:reason,status:'suspended'} }
);  
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_HOST_USER, 
    pass: process.env.EMAIL_HOST_PASSWORD, 
  },
});
const mailOptions = {
  from: process.env.EMAIL_HOST_USER,
  to: email,
  subject: "Your ProPhone Account Has Been Suspended",
  text: `Dear User,
    
    Your ProPhone account has been suspended for the following reason:
    ${reason}
    
    If you believe this is a mistake or would like to appeal this decision,
    please contact our support team at support@prophone.io.
    
    Best regards,
    The ProPhone Team`,
};
await transporter.sendMail(mailOptions);
return res.send("1"); 
}
exports.deleteuser = async (req, res) => {
  const { email, reason } = req.body; 
  await usersCollection.findOneAndDelete(
    { email },
    
);  

return res.send("1"); 
}

exports.registeruser = async (req, res) => {
  const { data, plan,fb,google } = req.body; 
  if (!data) {
    return res.status(400).json({ message: "Invalid request format" });
  }

  const { email, password, firstName, lastName,avatar,name } = data;
  if ((!req.body.google && !req.body.fb) && (!email || !password || !firstName || !lastName || !plan)) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    const token = jwt.sign({ user_id: existingUser._id,email: email  }, SECRET_KEY, { expiresIn: '1h' });
  
    // return res.json({  token:token });
    await usersCollection.findOneAndUpdate(
      { email },
      { $set: { lastLogin: new Date()} }
  );  
    
    if (existingUser.fb){
      const ownerData = {
  
        token: token,
        name: name,
        email: email,
        fb: 1,
        role: 'user',
        avatar: ''
      };
      return res.json({ownerData });
    }else if (existingUser.google){
      
      const ownerData = {
  
        token: token,
        name: name,
        email: email,
        google: 1,
        role: 'user',
        avatar: avatar
      };
      return res.json({ownerData });
    }else{
    return res.status(409).json({ message: "Email already in use" });
// 
    }
    
  }

  if (google) {
     await usersCollection.findOneAndUpdate(
        { email },
        { $set: { lastLogin: new Date()} }
    );  
    const newUser = {
      email,
      name: firstName,
      avater: avatar,
      plan,
      google,
      createdAt: new Date(),
    };
  
    const result = await usersCollection.insertOne(newUser);
  
    const token = jwt.sign({ user_id: result.insertedId,email: email  }, SECRET_KEY, { expiresIn: '1h' });
  
    // return res.json({  token:token });
  
  
  
    const ownerData = {
  
      token: token,
      name: firstName,
      email: email,
      google: 1,
      role: 'user',
      avatar: ''
    };
    return res.json({ownerData });
  }
  if (fb) {
    await usersCollection.findOneAndUpdate(
      { email },
      { $set: { lastLogin: new Date()} }
  );  
    const newUser = {
      email,
      name: firstName,
      plan,
      fb,
      createdAt: new Date(),
    };
  
    const result = await usersCollection.insertOne(newUser);
  
    const token = jwt.sign({ user_id: result.insertedId,email: email  }, SECRET_KEY, { expiresIn: '1h' });
  
    // return res.json({  token:token });
  
  
  
    const ownerData = {
  
      token: token,
      name: firstName,
      email: email,
      fb: 1,
      role: 'user',
      avatar: ''
    };
    return res.json({ownerData });
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

  const token = jwt.sign({ user_id: result.insertedId,email: email  }, SECRET_KEY, { expiresIn: '1h' });

  // return res.json({  token:token });

  await usersCollection.findOneAndUpdate(
    { email },
    { $set: { lastLogin: new Date()} }
);  

  const ownerData = {

    token: token,
    name: firstName+ ' ' + lastName,
    email: email,
    role: 'user',
    avatar: ''
  };
  return res.json({ownerData });


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
    // if (email === 'dallas@prophone.io' && password === 'owner') {
    //   // const token = jwt.sign({ user_id: 1 }, SECRET_KEY, { expiresIn: '1h' });
    //   const token = jwt.sign({ user_id: 1,email:  'dallas@prophone.io'  }, SECRET_KEY, { expiresIn: '1h' });

    //   const ownerData = {

    //     token: token,
    //     name: 'Dallas Reynolds',
    //     email: 'dallas@prophone.io',
    //     role: 'owner',
    //     avatar: 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png'
    //   };
    //   return res.json({ownerData });
    //   // return res.send(ownerData);
    //   // login(ownerData);
    // }
    try {
      

  
 

      const user = await usersCollection.findOne({ email });
      if (!user) {
          return res.send("0");  
      }

      // if (user.googleauth === 1) {
      //     if (user.suspened === 1) {
      //         return res.json({ reason: user.reason });
      //     } else if (user.subscribed === 1) {
      //         if (fcmtoken) {
      //             await usersCollection.findOneAndUpdate(
      //                 { email },
      //                 { $set: { fcm_token: fcmtoken, logout: 0 } }
      //             );
      //         }

             
      //         // const token = jwt.sign({ user_id: user._id }, SECRET_KEY, { expiresIn: '1h' });
      // const token = jwt.sign({ user_id: user._id,email:  user.email  }, SECRET_KEY, { expiresIn: '1h' });

      //         const ownerData = {

      //           token: token,
      //           name: user.firstname+ ' ' + user.lastname,
      //           email: user.email,
      //           role: 'user',
      //           avatar: user.avater
      //         };
      //         return res.json({ownerData }); 
      //         // return res.json({ id: user.id, token });
      //     } else {
      //         return res.send("0"); 
      //     }
      // }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
          if (user.suspened === 1) {
              return res.json({ reason: user.reason });
          } else  {
              if (fcmtoken) {
                  await usersCollection.findOneAndUpdate(
                      { email },
                      { $set: { fcm_token: fcmtoken, logout: 0 } }
                  );
              }

              // const token = jwt.sign({ user_id: user.id }, SECRET_KEY, { expiresIn: '1h' });
      const token = jwt.sign({ user_id: user._id,email:  user.email  }, SECRET_KEY, { expiresIn: '1h' });
      await usersCollection.findOneAndUpdate(
        { email },
        { $set: { lastLogin: new Date()} }
    );        
      let ownerData;

      if (email === "dallas@prophone.io") {
        ownerData = {
          token: token,
          name: user.firstname + ' ' + user.lastname,
          email: user.email,
          role: 'owner',
          avatar: user.avatar, 
        };
        
      } else {
        ownerData = {
          token: token,
          name: user.firstname + ' ' + user.lastname,
          email: user.email,
          role: 'user',
          avatar: user.avatar,
        };
      }
      console.log(ownerData)
      return res.json({ ownerData });
      

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
