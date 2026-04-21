import './App.css'
import Chat from './features/chat/Chat'
import Login from "./features/users/Login.tsx";
import {Navigate, Route, Routes} from "react-router";
import Register from './features/users/Register.tsx';
import {ProtectedRoute} from "./components/ProtectedRoute/ProtectedRoute.tsx";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/chat" replace/>}/>
                <Route path="*" element={<Navigate to="/chat" replace/>}/>
            </Routes>
        </>
    )
}

export default App
