import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import React, {useEffect, useRef, useState} from "react";
import {
    addMessage,
    selectMessages,
    selectOnlineUsers,
    setConnectionStatus,
    setMessages, setOnlineUsers
} from "./store/chatSlice.ts";
import SendIcon from '@mui/icons-material/Send';
import type {IncomingMessage, OutgoingMessage} from "../../types";
import {
    Avatar,
    Box,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import "./chatStyles.css";
import UsersList from "./components/UsersList.tsx";
import {selectUser} from "../users/store/usersSlice.ts";
import dayjs from "dayjs";
import bgGradient from '../../assets/bg-gradient.png';
import pattern from '../../assets/pattern.png';
import {API_URL} from "../../constants.ts";

const Chat = () => {
    const dispatch = useAppDispatch();
    const [messageForm, setMessageForm] = useState('');

    const messages = useAppSelector(selectMessages);
    const onlineUsers = useAppSelector(selectOnlineUsers);
    const currentUser = useAppSelector(selectUser);

    const bottomRef = useRef<HTMLDivElement>(null);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const socket = useRef<WebSocket | null>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();

        if (!messageForm.trim() || !socket.current) {
            return;
        }

        const message: IncomingMessage = {
            type: 'SEND_MESSAGE',
            payload: messageForm,
        };

        socket.current.send(JSON.stringify(message));
        setMessageForm('');
    }

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:8008/chat');

        socket.current.onopen = () => {
            dispatch(setConnectionStatus(true));
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };

        socket.current.onmessage = (event) => {
            const decoded: OutgoingMessage = JSON.parse(event.data);
            switch (decoded.type) {
                case 'HISTORY':
                    dispatch(setMessages(decoded.payload));
                    scrollToBottom();
                    break;
                case 'NEW_MESSAGE':
                    dispatch(addMessage(decoded.payload));
                    scrollToBottom();
                    break;
                case 'UPDATE_USER_LIST':
                    dispatch(setOnlineUsers(decoded.payload));
                    break;
            }
        };

        socket.current.onclose = (e) => {
            dispatch(setConnectionStatus(false));
            if (e.code !== 1000) {
                if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
                reconnectTimeout.current = setTimeout(() => connect(), 5000);
            }
        };
    };

    useEffect(() => {
        connect();

        return () => {
            if (socket.current) {
                socket.current.close(1000);
            }

            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, [])

    return (
        <Box className="chat-wrapper">
            <Box className="user-list-wrapper">
                <UsersList onlineUsers={onlineUsers}/>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <Box sx={{p: 2}}>
                    <Typography variant="h6">Chat</Typography>
                </Box>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundImage: `url(${bgGradient})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}>
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${pattern})`,
                        backgroundRepeat: 'repeat',
                        opacity: 0.1,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}/>

                    <Box className="chat-main-area"
                         sx={{
                             flex: 1,
                             overflowY: 'auto',
                             padding: '10px 60px',
                             display: 'flex',
                             flexDirection: 'column',
                             position: 'relative',
                             zIndex: 1
                         }}>
                        {messages.map((msg) => {
                            const isMe = msg.user._id === currentUser?._id;

                            const messageDate = dayjs(msg.createdAt);
                            const now = dayjs();

                            let textDate = messageDate.format('DD.MM.YYYY');

                            if (messageDate.isAfter(now.startOf('day'))) {
                                textDate = messageDate.format('HH:mm');
                            } else if (messageDate.isAfter(now.subtract(1, 'day').startOf('day'))) {
                                textDate = 'Yesterday'
                            }

                            return (
                                <Box key={msg._id}
                                     sx={{alignSelf: isMe ? 'flex-end' : 'flex-start', mb: 2, minWidth: '100px'}}>
                                    <Box sx={{display: 'flex', alignItems: 'flex-end', gap: '10px'}}>
                                        {!isMe && (
                                            <Avatar
                                                src={(API_URL + '/' + msg.user.avatar) || msg.user.avatar || undefined}/>
                                        )}
                                        <Box className={`message-bubble ${isMe ? 'bubble-right' : 'bubble-left'}`}>
                                            {!isMe && (
                                                <Typography variant="caption" sx={{display: 'block', color: '#bf94ff'}}>
                                                    {msg.user.displayName}
                                                </Typography>
                                            )}
                                            <Typography variant="body1" sx={{color: '#fff'}}>{msg.text}</Typography>
                                            <Typography variant="caption"
                                                        sx={{display: 'block', textAlign: 'right', color: '#acacac'}}>
                                                {textDate}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                        <div ref={bottomRef}/>
                    </Box>
                    <Box component="form" onSubmit={sendMessage} sx={{p: 2}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <TextField
                                fullWidth
                                placeholder="Message"
                                value={messageForm}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {border: 'none'},
                                    '&:hover .MuiOutlinedInput-notchedOutline': {border: 'none'},
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {border: 'none'},
                                    '& .MuiInputBase-root': {
                                        backgroundColor: '#212121',
                                        borderRadius: '20px',
                                        color: '#fff',
                                        padding: '4px 12px',
                                        fontSize: '15px',
                                    }
                                }}
                                onChange={(e) => setMessageForm(e.target.value)}
                            />
                            <IconButton type="submit"
                                        sx={{color: "#fff", backgroundColor: "#7b3be1", width: "50px", height: "50px"}}>
                                <SendIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Chat;