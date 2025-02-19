import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import connectDb from './utils/db.js'

import userRouter from "./Router/user-router.js"
import bookRouter from "./Router/book-router.js"
import contactRouter from "./Router/contact-router.js"
import purchaseRouter from "./Router/purchaseRouter.js"
import graphRouter from "./Router/graph-router.js"
import reviewRouter from "./Router/review-router.js";
import locationRouter from "./Router/location-router.js";

import bodyParser from "body-parser"; 

import { processCommand } from './services/voice-assistance.js'

dotenv.config();

const app = express();
const corsOption = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credential: true,
};
app.use(cors(corsOption));
app.use(express.json());

app.use(bodyParser.json());

app.use("/api/users",userRouter);
app.use('/api', bookRouter);
app.use('/api',contactRouter);
app.use('/api',purchaseRouter);
app.use('/purchase', graphRouter);
app.use('/api/reviews',reviewRouter);
app.use('/api/locations',locationRouter);

const PORT = 5000;
connectDb().then(()=> {
    app.listen(PORT, ()=> {
        console.log(`Server is running on port ${PORT}`);
    })
})

app.post("/process-command", (req, res) => {
  try {
    const { command, username } = req.body; 
    if (!command) {
      throw new Error("Command is missing from the request body.");
    }
    console.log("Command received:", command);
    console.log("Username received:", username);

    const { responseText, action, url } = processCommand({ command, username });
    res.json({ response: responseText, action, url });
  } catch (error) {
    console.error("Error in /process-command:", error.message);
    res.status(500).json({ message: error.message });
  }
});


app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
