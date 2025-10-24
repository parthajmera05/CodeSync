
import express from "express";
import http from "http";
import cors from "cors";
import cron from "node-cron";
import axios from "axios";
import socketConnection from "./socket.js";
import dotenv from "dotenv";
dotenv.config();
//Express Server
const app = express();

//Http Server
const server = http.createServer(app);


//Socket Connection
socketConnection(server);

app.use(cors());
app.use(express.json());
//Health
app.get("/", (req, res) => {
  res.send("Server is running!");
});
//keep alive
app.get("/keep-alive", (req, res) => {
  console.log("Dummy route accessed at", new Date().toLocaleString());
  res.send("Server is alive");
});
//to Run render server
cron.schedule("*/8 * * * *", async () => {
  try {
    const response = await axios.get(process.env.BACKEND_URL + "/keep-alive");
    console.log("Response from dummy route:", response.data);
  } catch (error) {
    console.error("Error accessing the dummy route:", error.message);
  }
});
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
