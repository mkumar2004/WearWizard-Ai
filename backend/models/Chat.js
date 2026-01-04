const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
   UserChat: [
      {
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        Day:{
          type: Day,
          default: Date.now
        }
      }
    ],
       AiChat: [
      {
        text: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        },
        Day:{
          type: Day,
          default: Date.now
        }
      }
    ],
},
{timestamps:true}
)