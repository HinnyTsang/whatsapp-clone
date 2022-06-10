import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { RecipientIds } from './ConversationsContext';

interface SocketProps {
  children: React.ReactNode;
  id: string;
}
export interface SendMessageInterface {
  recipientIds: RecipientIds;
  text: string;
}

const SocketContext = createContext<Socket>(
  null as unknown as Socket
);

export const useSocket = () => useContext<Socket>(SocketContext);

export const SocketProvider = ({ children, id }: SocketProps) => {
  const [socket, setSocket] = useState<Socket>(
    null as unknown as Socket
  );

  // initialize socket for each login
  useEffect(() => {
    console.log('socket changed');
    if (!id) return;

    const newSocket = io('http://localhost:5000', {
      query: { id },
      transports: ['websocket'],
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
