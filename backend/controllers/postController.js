import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;
    console.log(req.body);

    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and text fields are required" });
    }

    const user = await User.findById(postedBy);

    if (!user) return res.status(400).json({ error: "user not found" });

    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Unauthorised to create post" });
    }

    const maxLength = 500;

    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    const newPost = new Post({ postedBy, text, img });
    await newPost.save();
    return res
      .status(201)
      .json({ message: "Post created successfully", newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("create post err => ", error.message);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("get post err => ", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorised to delete post" });
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Delete post err => ", error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // unlike
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      // like
      await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
      res.status(200).json({ message: "Post liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Like post err => ", error.message);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    const username = req.user.username;
    const userProfilePic = req.user.profilePic;

    if (!text) {
        return res.status(400).json({error: "Text field is required."})
    }
    
    const post = await Post.findById(postId)
    if (!post) {
        return res.status(400).json({error: "Post not found."})
    }

    const reply = {userId, text, userProfilePic, username}
    post.replies.push(reply)
    await post.save()

    return res.status(200).json({message: "Reply added successfully.", post})

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("reply post err => ", error.message);
  }
};

const getFeedPosts = async(req,res) => {
    try {
    const userId = req.user._id
    const user = await User.findById(userId);

    if (!user) return res.status(400).json({ error: "user not found" });

    const following = user.following

    const feedPosts = await Post.find({ postedBy: { $in: following }}).sort({ createdAt: -1 })

    res.status(200).json(feedPosts)

    } catch (error) { 
        res.status(500).json({ error: error.message });
        console.log("feed post err => ", error.message);
    }
}

export { createPost, getFeedPosts, getPost, deletePost, likeUnlikePost, replyToPost };