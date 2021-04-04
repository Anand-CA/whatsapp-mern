import axios from "axios";

const instance = axios.create({
  baseURL: "https://whatsapp-chat-mern.herokuapp.com",
});

export default instance;
