import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import React, {useEffect, useRef, useState} from "react";
import {
    addMessage,
    selectIsConnected,
    selectMessages,
    selectOnlineUsers,
    setConnectionStatus,
    setMessages, setOnlineUsers
} from "./store/chatSlice.ts";
import type {IncomingMessage, OutgoingMessage} from "../../types";

const Chat = () => {
    const dispatch = useAppDispatch();
    const [messageForm, setMessageForm] = useState('');

    const messages = useAppSelector(selectMessages);
    const onlineUsers = useAppSelector(selectOnlineUsers);
    const isConnected = useAppSelector(selectIsConnected);

    const bottomRef = useRef<HTMLDivElement>(null);
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const socket = useRef<WebSocket | null>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    };

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
        <div>

        </div>
    );
};

export default Chat;