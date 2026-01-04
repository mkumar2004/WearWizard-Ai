const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('./../models/User');
const Profile = require('./../models/Profile');
// LOGIN API

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        let user = await User.findOne({ email });
  
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

     
        const payload = {
            user: { _id: user._id, username: user.username, role: user.role }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '10m',
        });

       
        res.json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

// REGISTER API

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, } = req.body;

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});

//Profile API
// router.put('/profile',async(req,res)=>{
//     try {
//         const ProfileData = await Profile.create(req.body);
        
//         const existingProfile = await Profile.findOne({userId:ProfileData.userId});
//         if(existingProfile){
//            res.status(201).json({
//             message:"Profile created successfully",
//            })
//         }
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Server Error" });
//     }
// })
router.patch('/profile', async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },   
      { new: true, runValidators: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        message: "Profile not found"
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



module.exports = router;
