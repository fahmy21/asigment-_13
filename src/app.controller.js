import express from 'express';
import { globle_handlin_erorr, Not_Found_Exception } from './common/response/response.error.js';
import { Database_Connection } from './database/connection.js';
import authRouter from './module/auth/auth.controller.js'
import userRouter from './module/user/user.controller.js'
import path from "path";
import { fileURLToPath } from "url";
import { connection_redis } from './database/redis.js';
import cors from "cors";
import messagesRouter from './module/message/message.controller.js';

export const bootstrap = async () => {
    const app = express()
    app.use(express.json())
    app.use(cors({
        origin:"*"
    }))
    Database_Connection()
    connection_redis()
    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/messages", messagesRouter)
   

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
    app.use(globle_handlin_erorr)
    ////////////////////////////////////////////////////////

    app.use("{*dummy}", (req, res) => {
        res.json({ message: "The api is wrong" })

    })

    /////////////////////// /////////////////////////////////

    app.listen(3000, () => {
        console.log("server is running on port 3000")
    })
}