import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {GOOGLE_CLIENT_ID} from "./constants.ts";
import {Provider} from "react-redux";
import {store} from "./app/store.ts";
import {CssBaseline} from "@mui/material";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <Provider store={store}>
                    <CssBaseline/>
                    <App/>
                    <ToastContainer/>
                </Provider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    </StrictMode>,
)
