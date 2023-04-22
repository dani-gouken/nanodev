import { Outlet } from "react-router-dom";
import { Navigation } from "../../components/Navigation";
import { useAuth } from "../../hooks/useAuth";
import { Authenticated } from "../../middlewares/Authenticated";

export function Dashboard() {
    const { user, logout } = useAuth();
    return (
        <div className="max-w-screen-lg mx-auto">
            <Navigation />
            <Authenticated />
        </div>
    )
}
