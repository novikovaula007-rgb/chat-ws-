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