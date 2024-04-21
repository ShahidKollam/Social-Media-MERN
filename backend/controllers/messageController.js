import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

async function sendMessage(req, res) {
  try {
    const { reciepientId, message } = req.body;
    let { img } = req.body
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciepientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, reciepientId],
        lastMessage: { text: message, sender: senderId },
      });
    }
    await conversation.save();

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img)
      img = uploadResponse.secure_url
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });
    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: { text: message, sender: senderId },
      }),
    ]);

    const reciepientSocketId = getRecipientSocketId(reciepientId)
    if (reciepientSocketId) {
      const ok = io.to(reciepientSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req, res) {
  const { otherUserId } = req.params;
  const userId = req.user._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getConversations(req, res) {
  const userId = req.user._id;
  try {
        const conversations = await Conversation.find({
          participants: userId,
        }).populate({
          path: "participants",
        select: "username profilePic",
        });

        conversations.forEach(conversation => {
          conversation.participants = conversation.participants.filter(
            participant => participant._id.toString() !== userId.toString()
          )
        })

        res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export { sendMessage, getMessages, getConversations };
