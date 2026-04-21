export interface User {
    _id: string;
    username: string;
    token: string;
    role: string;
    displayName: string;
    avatar: string | null;
    googleID?: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    };
    message: string;
    name: string;
    _message: string;
}

export interface GlobalError {
    error: string;
}

export interface RegisterMutation {
    username: string;
    password: string;
    displayName: string;
    avatar: string | null | File;
}

export interface LoginMutation {
    username: string;
    password: string;
}

export interface UserPayload {
    _id: string;
    displayName: string;
    avatar?: string | null;
}

export interface ChatMessage {
    _id: string;
    text: string;
    user: UserPayload;
    createdAt: string;
}

export type OutgoingMessage =
    | {
    type: 'HISTORY';
    payload: ChatMessage[];
}
    | {
    type: 'NEW_MESSAGE';
    payload: ChatMessage;
}
    | {
    type: 'UPDATE_USER_LIST';
    payload: User[];
};

export interface IncomingMessage {
    type: 'SEND_MESSAGE';
    payload: string;
}