import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { User } from "../services/auth";
import { HeroCard } from "../components/HeroCard";
const key = "_user";

export const UserContext = createContext<[User | null, (user: User | null) => void]>([null, () => { }])

export const useUser = () => useContext(UserContext)

export const useAuth = () => {
    const [user, setUser] = useUser();
    return {
        authenticated: user != null,
        user,
        login: (user: User) => {
            localStorage.setItem(key, JSON.stringify(user))
            setUser(user)
        },
        logout: () => {
            localStorage.removeItem(key);
            setUser(null)
        },
    };
}
export const readCachedUser = () => {
    const cached = localStorage.getItem(key);
    let user: User | null = null
    if (cached != null) {
        try {
            user = JSON.parse(cached) as User | null;
        } catch (e) {
            console.error(e);
        }
    }
    return user;
}

export const UserContextProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setUser(readCachedUser());
        setLoading(false)
    }, [])

    return (
        <UserContext.Provider value={[user, setUser]}>
            {loading ? (
                <HeroCard>
                    <p >Loading...</p>
                </HeroCard>
            ) : (
                children
            )}
        </UserContext.Provider>
    )
}
