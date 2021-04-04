import "./App.css"
import Body from "./Body"
import axios from "./axios"
import { useEffect, useState } from "react"
import Login from "./Login"
import { useStateValue } from "./StateProvider"

function App() {
   const [{ user }, dispatch] = useStateValue()
   const [messages, setMessages] = useState([])
   useEffect(() => {
      axios.get("/messages").then((response) => {
         setMessages(response.data)
      })
   }, [])
   console.log()
   return (
      <div className="app">
         {user ? (
            <div className="app__container">
               <Body />
            </div>
         ) : (
            <Login />
         )}
      </div>
   )
}

export default App
