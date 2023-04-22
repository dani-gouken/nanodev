import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

export function Navigation() {
    const { logout } = useAuth();
    return (<div className="navbar bg-base-100 mb-8">
        <div className="navbar-start">
            <a className="btn btn-ghost normal-case text-xl">City Requests</a>
            Citizen
        </div>
        <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
                <li><NavLink to="/dashboard">My Requests</NavLink></li>
            </ul>
        </div>
        <div className="navbar-end">
            <NavLink to="/dashboard/request" className="me-2 btn btn-info text-white btn-active">Make a request</NavLink>
            <button onClick={() => logout()} className="btn btn-ghost btn-active">Logout</button>
        </div>
    </div>)
}
