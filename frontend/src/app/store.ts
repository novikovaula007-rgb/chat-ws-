import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import {usersReducer} from "../features/users/store/usersSlice.ts";
import {chatReducer} from "../features/chat/store/chatSlice.ts";

const userPersistConfig = {
    key: 'store:users',
    storage,
    whitelist: ['user'],
};

const rootReducer = combineReducers({
    chat: chatReducer,
    users: persistReducer(userPersistConfig, usersReducer)
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;