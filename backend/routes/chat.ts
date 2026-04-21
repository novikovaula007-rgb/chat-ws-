import {Instance} from "express-ws";
import {Router} from "express";
import Message from "../models/Message";
import jwt from "jsonwebtoken";
import User from "../models/User";
import config from "../config";
import {ActiveConnections, ChatMessage, IncomingMessage, OutgoingMessage} from "../types";

const activeConnections: ActiveConnections = {};

export const createChatRouter = (wsInstance: Instance) => {
    const router = Router();
    wsInstance.applyTo(router);

    const sendUpdatedUserList = async () => {
        const onlineIds = Object.keys(activeConnections);

        const usersOnline = await User.find(
            {_id: {$in: onlineIds}},
            'displayName avatar'
        ).lean();

        const message = JSON.stringify({
            type: 'UPDATE_USER_LIST',
            payload: usersOnline
        });

        Object.values(activeConnections).forEach(ws => {
            if (ws.readyState === 1) {
                ws.send(message);
            }
        });
    };

    router.ws('/', async (ws, req) => {
        try {
            const token = req.cookies.token;

            if (!token) {
                return ws.close(4001, "No token");
            }

            const decoded = jwt.verify(token, config.JWTSecret) as { _id: string };

            const user = await User.findOne({_id: decoded._id, token});

            if (!user) {
                return ws.close(4001, "Invalid token");
            }

            const userId = user._id.toString();
            activeConnections[userId] = ws;

            await sendUpdatedUserList();

            console.log(`User ${user.displayName} connected`);

            const messages = await Message.find()
                .sort({createdAt: -1})
                .limit(30)
                .populate('user', 'displayName avatar');

            const messagesHistory: OutgoingMessage = {
                type: 'HISTORY',
                payload: messages.reverse() as unknown as ChatMessage[]
            }

            ws.send(JSON.stringify(messagesHistory));

            ws.on('message', async (msg: string) => {
                try {
                    const decodedMsg: IncomingMessage = JSON.parse(msg);

                    if (decodedMsg.type === 'SEND_MESSAGE') {
                        const newMessage = new Message({
                            user: user._id,
                            text: decodedMsg.payload
                        });

                        await newMessage.save();

                        const broadcastData = JSON.stringify({
                            type: 'NEW_MESSAGE',
                            payload: {
                                _id: newMessage._id,
                                text: newMessage.text,
                                user: {
                                    _id: user._id,
                                    displayName: user.displayName,
                                    avatar: user.avatar
                                },
                                createdAt: newMessage.createdAt
                            }
                        });

                        Object.values(activeConnections).forEach(conn => {
                            if (conn.readyState === 1) {
                                conn.send(broadcastData);
                            }
                        });
                    }
                } catch (e) {
                    console.error(e);
                }
            });

            ws.on('close', async () => {
                delete activeConnections[userId];
                console.log(`User ${user.displayName} disconnected`);
            });
        } catch (e) {
            ws.close(4001);
        }
    });
    return router;
};