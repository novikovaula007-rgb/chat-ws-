import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {ChatMessage, User, UserPayload} from "../../../types";
import type {RootState} from "../../../app/store.ts";

interface ChatState {
    messages: ChatMessage[];
    onlineUsers: UserPayload[];
    isConnected: boolean;
}

const initialState: ChatState = {
    messages: [],
    onlineUsers: [],
    isConnected: false,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
        },

        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },

        setOnlineUsers: (state, action: PayloadAction<User[]>) => {
            state.onlineUsers = action.payload;
        },

        setConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.isConnected = action.payload;
        },

        clearChat: (state) => {
            state.messages = [];
            state.onlineUsers = [];
        }
    },
});

export const {
    setMessages,
    addMessage,
    setOnlineUsers,
    setConnectionStatus,
    clearChat
} = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;
export const selectOnlineUsers = (state: RootState) => state.chat.onlineUsers;
export const selectIsConnected = (state: RootState) => state.chat.isConnected;


export const chatReducer = chatSlice.reducer;