import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useApi } from "../ApiProvider";
import Auth from "../../lib/Auth";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const { baseUrl } = useApi();
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const newSocket = io('4friends.tech', {
            transports: ['websocket'],
            query: {
                token: `${Auth.getToken()}`
            }
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [baseUrl]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
