import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
   apiKey: "AIzaSyCV-TEzWKmCExA92UtM-s4YQHf9SioklcQ",
   authDomain: "whatsapp-clone-ab32a.firebaseapp.com",
   projectId: "whatsapp-clone-ab32a",
   storageBucket: "whatsapp-clone-ab32a.appspot.com",
   messagingSenderId: "511902318706",
   appId: "1:511902318706:web:2e5b3f7e625688394e42eb",
})

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const provider = new firebase.auth.GoogleAuthProvider()
export { db, auth, storage, provider }
