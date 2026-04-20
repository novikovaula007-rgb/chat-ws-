import dotenv from "dotenv";

dotenv.config();

import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import cookieParser from "cookie-parser";

const port = 8008;
const baseApp = express();

const wsInstance = expressWs(baseApp);
const {app} = wsInstance;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(cookieParser());
app.use(cors());
app.use(express.json());

const run = async () => {
    app.listen(port, () => {
        console.log('Server running on port ' + port);
    })
}

run().catch((e) => console.error(e));