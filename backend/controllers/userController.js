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
    console.log("server err => ",error.message);
  }
};

export { signupUser };
