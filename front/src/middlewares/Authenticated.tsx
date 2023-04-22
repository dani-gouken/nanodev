import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useAuth";
import { PropsWithChildren } from "react";

export function Authenticated() {
    const [user, _] = useUser();

    if (user == null) {
        return <Navigate to="/login" />
    }
    return <Outlet />;
}
