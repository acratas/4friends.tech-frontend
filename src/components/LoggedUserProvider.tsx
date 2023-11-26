import React, {useCallback, useEffect} from "react";
import {useAddress} from "@thirdweb-dev/react";
import {MainUser} from "../lib/User";

const LoggedUserContext = React.createContext<{
    loggedUser: MainUser | null,
    setLoggedUser: (mainUser: MainUser | null) => void
}>({
    loggedUser: null,
    setLoggedUser: (mainUser: MainUser | null) => {}
});

export const useLoggedUser = () => {
    return React.useContext(LoggedUserContext);
}

const getFromStorage = (address: string) => {
    address = address.toLowerCase();
    if (localStorage.getItem(address)) {
        const data = JSON.parse(localStorage.getItem(address) || '');
        if (data.timestamp > Date.now()) {
            return data.content;
        }
    }
    return null;
}

const setToStorage = (content: any, ttl: number = 3600) => {
    localStorage.setItem(content.address.toLowerCase(), JSON.stringify({
        content,
        timestamp: Date.now() + ttl * 1000
    }));
}

export const LoggedUserProvider = ({ children }: any) => {
    const [user, setUser] = React.useState<MainUser | null>(null);
    const address = useAddress();


    useEffect(() => {
        if (address) {
            setUser(getFromStorage(address));
        }
    }, [address]);

    const setLoggedUser = (user) => {
        setUser(user);
        setToStorage(user);
    }

    return (<LoggedUserContext.Provider value={{loggedUser: user, setLoggedUser}}>
        {children}
    </LoggedUserContext.Provider>)
}
