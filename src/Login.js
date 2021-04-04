import { Button } from "@material-ui/core"
import React from "react"
import { auth, provider } from "./firebase"
import "./Login.css"
import { useStateValue } from "./StateProvider"
function Login() {
   const [{}, dispatch] = useStateValue()
   const signIn = () => {
      auth
         .signInWithPopup(provider)
         .then((result) => {
            console.log("result >>>", result.user)
            dispatch({
               type: "SET_USER",
               user: result.user,
            })
         })
         .catch((error) => {
            alert(error.message)
         })
   }
   return (
      <div className="login">
         <h1>Google Authetication</h1>
         <img
            src="https://cdn.worldvectorlogo.com/logos/whatsapp-symbol.svg"
            alt=""
         />
         <Button onClick={signIn} variant="contained" color="primary">
            Sign In
         </Button>
      </div>
   )
}

export default Login
