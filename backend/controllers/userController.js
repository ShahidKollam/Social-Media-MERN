import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genTokenAndSetCookie from "../utils/helpers/genToken&setCookie.js";

     
const signupUser = async (req, res) => {
  try {

    const {name,email,username,password} = req.body
    const user = await User.findOne({$or: [{email},{username}]})

    if (user) {
        return res.status(400).json({ message: "User already exists" });
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
        res.status(400).json({ message: "Invalid user data" });
    }   

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("register err => ",error.message);
  }
};

const loginUser = async(req,res) => {
  try {
    const {username, password} = req.body
    const user = await User.findOne({username})
    const checkPassword = await bcrypt.compare(password, user?.password || "" )

    if (!user || !checkPassword) return res.status(400).json({ message: "Invalid username or password" });

    genTokenAndSetCookie(user._id, res)
    res.status(200).json({user});

  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Login err => ",error.message);
  }
}   

const logoutUser = (req,res) => {
  try {
    res.cookie("jwt", "", {maxAge: 1})
    res.status(200).json({ message: "User logged out successfully"});
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Logout err => ",error.message);
  }
}

const followUnFollowUser = async(req,res) => {
  try {
    
    const { id } = req.params
    const userToModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if(id == req.user._id) return res.status(400).json({ message: "you cannot follow / unfollow yourself" });

    if(!userToModify || !currentUser) return res.status(400).json({ message: "user not found" });

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
    res.status(500).json({ message: error.message });
    console.log("Follow err => ",error.message);
  }
}
export { signupUser, loginUser, logoutUser, followUnFollowUser };
