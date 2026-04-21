import dotenv from "dotenv";

dotenv.config();

import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import cookieParser from "cookie-parser";
import {usersRouter} from "./routes/users";
import mongoose from "mongoose";
import config from "./config";
import {createChatRouter} from "./routes/chat";

const port = 8008;
const baseApp = express();

const wsInstance = expressWs(baseApp);
const {app} = wsInstance;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use('/users', usersRouter);

export const chatRouter = createChatRouter(wsInstance);
app.use('/chat', chatRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log("Server running on port " + port)
    });

    process.on('exit', () => {
        mongoose.disconnect();
    });
}

run().catch((e) => console.error(e));