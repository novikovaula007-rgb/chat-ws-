import {WebSocket} from 'ws';

export interface UserFields {
    username: string;
    password: string;
    role: string;
    token: string;
    displayName: string;
    googleID?: string;
    avatar: string | null | undefined;
}

export interface ChatMessage {
    _id: string | Types.ObjectId;
    text: string;
    user: {
        _id: string | Types.ObjectId;
        displayName: string;
        avatar: string | null | undefined;
    };
    createdAt: string | Date | NativeDate;
}

export interface ActiveConnections {
    [userId: string]: WebSocket;
}

export interface IncomingMessage {
    type: 'SEND_MESSAGE';
    payload: string;
}

export interface OutgoingMessage {
    type: 'NEW_MESSAGE' | 'HISTORY';
    payload: ChatMessage | ChatMessage[];
}