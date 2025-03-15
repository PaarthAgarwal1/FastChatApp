const mongoose=require("mongoose");

const messageSchema=new mongoose.Schema({
    chat_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        // required:true
    },
    receiver_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    sender_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    // messages: [
    //     {
    //         content: { type: String, required: true },
    //         message_type: { 
    //             type: String, 
    //             enum: ['text', 'other'], 
    //             required: true 
    //         }
    //     }
    // ],

    text:{
        type:String,
    },
    image:{
        type:String,
    },
    status:{
        type:String,
        enum:['sent','delivered','seen'],
        default:'sent'
    }
},{timestamps:true});

module.exports=mongoose.model('Message',messageSchema);