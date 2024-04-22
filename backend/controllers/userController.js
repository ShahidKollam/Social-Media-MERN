import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genTokenAndSetCookie from "../utils/helpers/genToken&setCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";
import nodemailer from "nodemailer";

const otpStore = {};

const generateOTP = () => {
  const otpLength = 6; 
  const otp = Math.random().toString().substr(2, otpLength);
  const expDate = Date.now() + 60 * 1000; // 1 minute expiration
  return { otp, expDate };
}; 

const sendOtpMail = async (email) => {
  try {
    const otpData = generateOTP();   
    otpStore[email] = otpData;
    console.log(otpStore);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { 
        user: process.env.EMAIL,    
        pass: process.env.PASSWORD,
      },
    }); 
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP code",
      text: `Please don't share Your OTP code to anyone. \n Your OTP code is ${otpData.otp} \n OTP valid for 1 minute only.`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Failed to send OTP email:", error.message);
          reject(error);
        } else {
          console.log("Email sent successfully ", mailOptions);
          resolve(true);
        }
      });
    });
  } catch (error) {
    console.log("sendOtpMail err => ", error.message);
    throw error
  }
};

const verifyOtp = async (req, res) => {
  console.log("body", req.body);

  try {

    const { otp, email } = req.body;
     
    const storedOtp = otpStore[email];

    if (!storedOtp) {m
      return res.status(400).json({error: "OTP not found. Please ensure you have requested an OTP."});
    }


    if (storedOtp && Date.now() < storedOtp.expDate) {
      if (otp === storedOtp.otp) {

        const updateInfo = await User.updateOne(
          { email: email }, 
          { $set: { isVerified: true } }
        );
        console.log(updateInfo);
        delete otpStore[email]; 
        res.status(200).json({ message: "Email verification successfull." });

      } else {
        res.status(400).json({ error: "OTP Invalid" });
      }
    } else {  
      res.status(400).json({ error: "OTP Expired. Please Resend OTP" });
    }
  } catch (error) {
    console.log("verifyOtp err => ", error.message);
    res.status(500).json({ error: error.message }); 
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const sendOtp = await sendOtpMail(email);
    console.log("sendOtp", sendOtp);

    if (sendOtp) {
      return res.status(201).json({ message: "OTP resend successfully" });
    } 

  } catch (error) {
    console.log("resendOtp err => ", error.message);
    return res.status(500).json({ error: "An error occurred while resending OTP" });
  }
};
           
const signupUser = async (req, res) => {
  try { 
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });  
    await newUser.save();
    
    const sendOtp = await sendOtpMail(email);
    console.log("sendOtp", sendOtp);


    if (newUser && sendOtp) {
      res.status(201).json(newUser);
    } else {
      res.status(400).json({ error: "Invalid user data" });                        
    }
  } catch (error) {
    console.log("register err => ", error.message);
    res.status(500).json({ error:  error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const checkPassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !checkPassword)
      return res.status(400).json({ error: "Invalid username or password" });

    if(user.isFrozen){
      user.isFrozen = false
      await user.save()
    }
    
    genTokenAndSetCookie(user._id, res);
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Login err => ", error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Logout err => ", error.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString())
      return res
        .status(400)
        .json({ error: "you cannot follow / unfollow yourself" });

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "user not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow user

      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // follow user

      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Follow err => ", error.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "user not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "you cannot update others profile data." });

    if (password) {
      if (password.length < 6)
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = uploadResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    user = await user.save();

    await Post.updateMany(
      { "replies.userId": userId },
      {
        $set: {
          "replies.$[reply].username": user.username,
          "replies.$[reply].userProfilePic": user.profilePic,
        },
      },
      { arrayFilters: [{ "reply.userId": userId }] }
    );

    // password must be null in response.
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("update user err => ", error.message);
  }
};

const getUserProfile = async (req, res) => {
  // query is either username or userId

  const { query } = req.params;
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }

    if (!user) return res.status(400).json({ error: "user not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("update user err => ", error.message);
  }
};

const googleAuth = async(req, res) => {
  try {
    console.log(req.body);
    const { name, email, profilePic } = req.body;
    const username = name
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {

      if(user.isFrozen){
        user.isFrozen = false
        await user.save()
      }
    
      genTokenAndSetCookie(user._id, res);

      res.status(200).json(user);

    } else {

      // register user

      const newUser = new User({
        name,
        email,
        username,
        profilePic,
        password: 123456,
        isVerified: true
      });
      
      const savedUser = await newUser.save();
      const token = genTokenAndSetCookie(savedUser._id, res);

      res.status(201).json(savedUser);
  
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("googleAuth user err => ", error.message);
  }
}

const getSuggestedUsers = async(req, res) => {
  try {
    const userId = req.user._id
    const userFolloweByYou = await User.findById(userId).select("following")

    const users = await User.aggregate([ 
      {
        $match: {
          _id: { $ne: userId },
        }
      },
      {
        $sample: { size: 10 }
      }
    ])

    const filteredUsers = users.filter(user => !userFolloweByYou.following.includes(user._id))
    const suggestedUsers = filteredUsers.slice(0, 4)

    suggestedUsers.forEach(user => user.password = null);

    res.status(200).json(suggestedUsers)

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const freezeAccount = async(req, res) => {
  try {
    const userId = req.user._id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    user.isFrozen = true;
    await user.save()

    res.status(200).json({ success: true})

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  resendOtp,
  verifyOtp,
  googleAuth,
  getSuggestedUsers,
  freezeAccount
};
