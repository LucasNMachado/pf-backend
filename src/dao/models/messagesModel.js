import mongoose from 'mongoose'

const messageCollection = 'Messages'

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const messagesModel = mongoose.model(messageCollection, messageSchema)

export default messagesModel