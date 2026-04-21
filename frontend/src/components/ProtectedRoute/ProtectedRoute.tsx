import React from "react";
import {selectUser} from "../../features/users/store/usersSlice.ts";
import {useAppSelector} from "../../app/hooks.ts";
import {Navigate} from "react-router";

interface Props {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({children}) => {
    const user = useAppSelector(selectUser);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};