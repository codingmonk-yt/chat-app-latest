import io from 'socket.io-client'; // Add this

const socket = io.connect('http://localhost:3001'); // Add this -- our server will run on port 4000, so we connect to it from here

export default socket;