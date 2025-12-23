import express from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import {toNodeHandler} from "better-auth/node";
import {auth} from "./config/betterAuth.js";
// import cors from "cors";

const app = express(); 


// mounting better-auth routes 
app.all("/api/auth/*", toNodeHandler(auth));

//middlewares 
app.use(express.json()); 


export default app; 