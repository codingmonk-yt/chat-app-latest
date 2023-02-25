import io from "socket.io-client"; // Add this

let socket = io("http://localhost:3001", {
  query: `user_id=${window.localStorage.getItem("user_id") || 0}`,
}); // Add this -- our server will run on port 4000, so we connect to it from here

export default socket;
