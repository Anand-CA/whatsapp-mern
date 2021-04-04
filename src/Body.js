import React, { useEffect, useRef, useState } from "react"
import "./Body.css"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import SearchIcon from "@material-ui/icons/Search"
import "emoji-mart/css/emoji-mart.css"
import { Picker } from "emoji-mart"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import MicIcon from "@material-ui/icons/Mic"
import SendIcon from "@material-ui/icons/Send"
import EmojiEmotionsSharpIcon from "@material-ui/icons/EmojiEmotionsSharp"
import { Avatar, IconButton } from "@material-ui/core"
import "emoji-mart/css/emoji-mart.css"
import Pusher from "pusher-js"
import axios from "./axios"
import { useStateValue } from "./StateProvider"
import MicRecorder from "mic-recorder-to-mp3"
import StopIcon from "@material-ui/icons/Stop"
const Mp3Recorder = new MicRecorder({ bitRate: 128 })
function Body() {
   // audio
   const [isRecording, setIsRecording] = useState(false)
   const [isBlocked, setIsBlocked] = useState(false)
   const [blobURL, setBlobURL] = useState("")

   const [{ user }, dispatch] = useStateValue()
   const [input, setInput] = useState("")
   const [messages, setMessages] = useState([])
   const endOfMessagesRef = useRef(null)
   console.table("user >>>", user)
   const scrollToBottom = () => {
      endOfMessagesRef.current.scrollIntoView({
         behaviour: "smooth",
      })
   }
   useEffect(() => {
      axios.get("/messages").then((res) => {
         setMessages(res.data)
      })
   }, [])

   useEffect(() => {
      navigator.getUserMedia(
         { audio: true },
         () => {
            console.log("Permission Granted")
         },
         () => {
            console.log("Permission Denied")
            setIsBlocked(true)
         }
      )
   },[])
   const start = () => {
      if (isBlocked) {
         console.log("Permission Denied")
      } else {
         Mp3Recorder.start()
            .then(() => {
               setIsRecording(true)
            })
            .catch((e) => console.error(e))
      }
   }
   const stop = () => {
      Mp3Recorder.stop()
         .getMp3()
         .then(([buffer, blob]) => {
            const blobURL = URL.createObjectURL(blob)
            setBlobURL(blobURL)
            console.log('blob url >>>',blobURL)
            setIsRecording(false)
         })
         .catch((e) => console.log(e))
   }

   useEffect(() => {
      const pusher = new Pusher("3330609c0f7137251f10", {
         cluster: "ap2",
      })

      const channel = pusher.subscribe("messages")
      channel.bind("inserted", function (newMessage) {
         console.log(JSON.stringify(newMessage))
         console.log("new messages 😄 >>> ", newMessage)
         setMessages([...messages, newMessage])
      })

      return () => {
         channel.unbind_all()
         channel.unsubscribe()
      }
   }, [messages])

   console.log("messagessss >>>>", messages)

   const sendMessage = (e) => {
      e.preventDefault()
      axios.post("/messages", {
         message: input,
         name: user.displayName,
         timestamp: new Date().toUTCString(),
         received: false,
      })
      setInput("")
      scrollToBottom()
   }

   const [showEmoji, setShowEmoji] = useState(false)
   const [chosenEmoji, setChosenEmoji] = useState(null)

   const toggleEmoji = () => {
      if (showEmoji) {
         setShowEmoji(false)
      } else {
         setShowEmoji(true)
      }
   }

   const addEmoji = (e) => {
      let emoji = e.native
      setInput(emoji)
   }
   return (
      <div className="body">
         {/* body header */}
         <div className="body__header">
            <div className="bodyHeader__left">
               <Avatar src={user.photoURL} />
               <div className="bodyHeader__center">
                  <p>{user.email}</p>
                  <p>last seen at 9:04pm</p>
               </div>
            </div>
            <div className="bodyHeader__right">
               <IconButton>
                  <SearchIcon />
               </IconButton>
               <IconButton>
                  <AttachFileIcon />
               </IconButton>
               <IconButton>
                  <MoreVertIcon />
               </IconButton>
            </div>
         </div>

         {/* body main */}
         <div className="body__main">
            {messages.map((message) => (
               <div
                  className={
                     message.name === user.displayName
                        ? "body__message__receiver"
                        : "body__message"
                  }
               >
                  <span
                     className={`bodyMessage__name ${
                        message.name === user.displayName &&
                        "bodyMessage__name__receiver"
                     }`}
                  >
                     {message.name}
                  </span>
                  <p>{message.message}</p>
                  <span className="bodyMessage__timestamp">
                     {message.timestamp}
                  </span>
               </div>
            ))}
            <div
               ref={endOfMessagesRef}
               style={{ height: "40px" }}
               className="scroll__div"
            ></div>
         </div>
         {/* body footer */}
         <div className="body__footer">
            <IconButton onClick={toggleEmoji}>
               <EmojiEmotionsSharpIcon />
               {showEmoji ? (
                  <div className="emoji__panel">
                     <Picker onSelect={addEmoji} />
                  </div>
               ) : (
                  ""
               )}
            </IconButton>

            <form className="bodyFooter__searchContainer">
               <input
                  value={input}
                  className="bodyFooter__search"
                  onChange={(e) => setInput(e.target.value)}
                  type="text"
               />

               <IconButton
                  onClick={sendMessage}
                  disabled={!input}
                  type="submit"
               >
                  <SendIcon />
               </IconButton>
            </form>

            <audio src={blobURL} controls="controls" />
            {isRecording ? (
               <IconButton onClick={stop} disabled={!isRecording}>
                  <StopIcon />
               </IconButton>
            ) : (
               <IconButton onClick={start} disabled={isRecording}>
                  <MicIcon />
               </IconButton>
            )}
         </div>
      </div>
   )
}

export default Body
