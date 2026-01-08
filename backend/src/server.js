import http from "http";;
import { connectDB } from "./config/db.js";
import app from "./app.js";
import { seedCuratedTags } from "./controllers/explore.controller.js"
import { initSocket } from "./sockets/socket.js";
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || 5000;

// creating HTTP server using the express app
const server = http.createServer(app)

// initialize socket.io with this server
initSocket(server);

// // make it accessible in controllers
// app.set("io", io) -- optional


// Connect to the database 
connectDB().then(() => {
  seedCuratedTags();
});


// Listening the server
server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
