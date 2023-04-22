import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../hooks/useAuth";

export function Public() {
    const [user, _] = useUser();

    if (user != null) {
        return <Navigate to="/dashboard" />
    }
    return <Outlet />;
}
