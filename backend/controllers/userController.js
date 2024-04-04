import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genTokenAndSetCookie from "../utils/helpers/genToken&setCookie.js";

     
const signupUser = async (req, res) => {
  try {

    const {name,email,username,password} = req.body
    const user = await User.findOne({$or: [{email},{username}]})

    if (user) {
        return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        name,
        email,
        username,
        password: hashedPassword,
    }) 
    await newUser.save()

    if (newUser) {
        genTokenAndSetCookie(newUser._id, res)
        res.status(201).json(newUser);
    } else {
        res.status(400).json({ error: "Invalid user data" });
    }   

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("register err => ",error.message);
  }
};

const loginUser = async(req,res) => {
  try {
    const {username, password} = req.body
    const user = await User.findOne({username})
    const checkPassword = await bcrypt.compare(password, user?.password || "" )

    if (!user || !checkPassword) return res.status(400).json({ error: "Invalid username or password" });

    genTokenAndSetCookie(user._id, res)
    res.status(200).json({user});

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Login err => ",error.message);
  }
}   

const logoutUser = (req,res) => {
  try {
    res.cookie("jwt", "", {maxAge: 1})
    res.status(200).json({ message: "User logged out successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Logout err => ",error.message);
  }
}

const followUnFollowUser = async(req,res) => {
  try {
    
    const { id } = req.params
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if(id === req.user._id.toString()) return res.status(400).json({ error: "you cannot follow / unfollow yourself" });

    if(!userToModify || !currentUser) return res.status(400).json({ error: "user not found" });

    const isFollowing = currentUser.following.includes(id)

    if (isFollowing) {
      // unfollow user

      await User.findByIdAndUpdate( id, { $pull: { followers: req.user._id } } )
      await User.findByIdAndUpdate( req.user._id, { $pull: { following: id } } )
      res.status(200).json({ message: "User unfollowed successfully"});

    } else {
      // follow user

      await User.findByIdAndUpdate( id, { $push: { followers: req.user._id } } )
      await User.findByIdAndUpdate( req.user._id, { $push: { following: id } } )
      res.status(200).json({ message: "User followed successfully"});

    }          
     
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Follow err => ",error.message);
  }
}

const updateUser = async (req,res) => {
  const { name, email, username, password, profilePic, bio} = req.body
  const userId = req.user._id 

  try {
    let user = await User.findById(userId)
    if(!user) return res.status(400).json({error: "user not found"})

    if(req.params.id !== userId.toString())
      return res.status(400).json({error: "you cannot update others profile data."}) 

    if(password){
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      user.password = hashedPassword
    }

    user.name = name || user.name
    user.email = email || user.email
    user.username = username || user.username
    user.profilePic = profilePic || user.profilePic
    user.bio = bio || user.bio
  
    user = await user.save()
    res.status(200).json({ message: "Profile upadated successfully", user });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("update user err => ",error.message);
  }
}

const getUserProfile = async(req,res) => {

  const { username } = req.params
  try {
    
    const user = await User.findOne({ username }).select("-password").select("-updatedAt")
    if(!user) return res.status(400).json({ error: "user not found" });

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("update user err => ",error.message);
  }
}


export { 
  signupUser,
  loginUser, 
  logoutUser, 
  followUnFollowUser, 
  updateUser,
  getUserProfile 
};
