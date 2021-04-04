const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
   message: String,
   name: String,
   timestamp: String,
   received: Boolean,
})

module.exports = mongoose.model("messages", messageSchema)
