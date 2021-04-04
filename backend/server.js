// import
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const Pusher = require("pusher")
const Messages = require("./messageModel")

// app config
const app = express()
const port = process.env.PORT || 9000
const pusher = new Pusher({
   appId: "1165216",
   key: "3330609c0f7137251f10",
   secret: "1dadac8f4e37d2f5fc1e",
   cluster: "ap2",
   useTLS: true,
})

// middlewares
app.use(express.json())
app.use(cors())

// db
mongoose.connect(
   "mongodb+srv://densec:densec@cluster0.vl60w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
   {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
   }
)
const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", function () {
   console.log("db connected sucessfully🚀")
   const messagesCollection = db.collection("messages")
   const changeStream = messagesCollection.watch()

   changeStream.on("change", (change) => {
      console.log("a change occured >>>", change)

      if (change.operationType == "insert") {
         const messageDetails = change.fullDocument
         pusher.trigger("messages", "inserted", {
            message: messageDetails.message,
            name: messageDetails.name,
            timestamp: messageDetails.timestamp,
            received: messageDetails.received,
         })
      }
   })
})

// routes
app.get("/", (req, res) => {
   res.send("Hello programmers🚀")
})

app.get("/messages", (req, res) => {
   Messages.find((err, data) => {
      if (err) {
         res.status(500).send(err)
      } else {
         res.status(200).send(data)
      }
   })
})
app.post("/messages", (req, res) => {
   const dbMessages = req.body
   Messages.create(dbMessages, (err, data) => {
      if (err) {
         res.status(500).send(err)
      } else {
         res.status(200).send("message created in Messages collection 👍")
      }
   })
})

// listening
app.listen(port, () => {
   console.log("listening on port 9000")
})
