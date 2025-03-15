const Message = require('../models/message');
const cloudinary = require('../config/cloudinary');
const { getReceiverSocketId,io } = require('../config/socket');
const User=require('../models/user');

const getMessages=async(req,res)=>{
    try {
        const {receiverId}=req.params;
        const sender_id=req.user._id;
        const messages=await Message.find({
            $or: [
                {sender_id:sender_id,receiver_id:receiverId},
                {sender_id:receiverId,receiver_id:sender_id}
            ]
        });
        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const sendMessage=async(req,res)=>{
    try {
        const {text,image}=req.body;
        const {receiverId}=req.params;
        const sender_id=req.user._id;

        const sender=await User.findById(sender_id);
        const receiver=await User.findById(receiverId);
        if(sender.blocked.includes(receiverId)||receiver.blocked.includes(sender_id)){
            return res.status(403).json({ message: "You can't send messages to this chat" });
        }
        let imageURL;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageURL=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            sender_id,
            receiver_id:receiverId,
            text,
            image:imageURL,
        });
        await newMessage.save();
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        };
        res.status(201).json(newMessage);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const recentMessage = async (req, res) => {
    try {
      const { userId, friendIds } = req.body;
      const messages = await Message.find({
        $or: friendIds.map(friendId => ({
          $or: [{ sender: userId, receiver: friendId }, { sender: friendId, receiver: userId }]
        }))
      })
      .sort({ createdAt: -1 })
      .select("message sender receiver createdAt");
  
      // Organize messages by friend ID
      const messageMap = {};
      friendIds.forEach(friendId => {
        const message = messages.find(msg => msg.sender === friendId || msg.receiver === friendId);
        messageMap[friendId] = message ? message.message : "No messages yet.";
      });
  
      res.json(messageMap);
    } catch (error) {
      console.error("Error fetching recent messages:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  

// const sendMessage = async (req, res) => {
//     try {
//         const { messages } = req.body;
//         console.log("message data from front end is here",messages);
//         const { receiverId } = req.params;
//         const sender_id = req.user._id; // Assuming you get sender from auth middleware

//         if (!receiverId || !messages || !Array.isArray(messages) || messages.length === 0) {
//             return res.status(400).json({ message: "Invalid request. Provide receiver_id, chat_id, and at least one message." });
//         }

//         // Process each message
//         const processedMessages = await Promise.all(
//             messages.map(async (msg) => {
//                 if (msg.message_type !== "text") {
//                     // Upload media to Cloudinary
//                     const uploadedFile = await cloudinary.uploader.upload(msg.content, {
//                         resource_type: "auto" // Automatically detect type (image, video, etc.)
//                     });

//                     return {
//                         content: uploadedFile.secure_url, // Cloudinary URL
//                         message_type: msg.message_type
//                     };
//                 }
//                 return msg; // Text messages remain unchanged
//             })
//         );

//         // Create message document
//         const newMessage = new Message({
//             receiver_id:receiverId,
//             sender_id,
//             messages: processedMessages,
//             status: "sent"
//         });

//         await newMessage.save();
//         res.status(201).json(newMessage);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

module.exports={getMessages,sendMessage,recentMessage}