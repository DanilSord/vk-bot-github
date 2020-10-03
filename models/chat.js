const mongoose = require( 'mongoose' )
const Schema = mongoose.Schema

const chatSchema = new Schema( {
  chatID: {
    type: Number,
    default: 0
  },
  repositories: [String]
} )

module.exports = mongoose.model('chats', chatSchema)