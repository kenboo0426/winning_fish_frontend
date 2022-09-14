import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { useCurrentUser } from './userAuth';

export const WebSocketContext = React.createContext<WebSocketStatus>(
  {} as WebSocketStatus
);

type WsUser = {
  id: number;
  name: string;
};

type WsJsonResponse = {
  action: string;
  joined_onine_match_user_ids: string[];
  users: WsUser[];
};

type Props = {
  children: React.ReactNode;
};

type WebSocketStatus = {
  socketrefCurrent: ReconnectingWebSocket;
  isConnected: boolean;
  onlinMatchStatus: WsJsonResponse | undefined;
};

export const WebSocketProvider: React.FC<Props> = ({ children }) => {
  const socketRef = React.useRef<ReconnectingWebSocket>();
  const socketrefCurrent = socketRef.current;
  const [isConnected, setIsConnected] = React.useState(false);
  const currentUser = useCurrentUser();
  const router = useRouter();
  const [onlinMatchStatus, setOnlinMatchStatuse] =
    React.useState<WsJsonResponse>();

  useEffect(() => {
    socketRef.current = new ReconnectingWebSocket(
      'ws://localhost:3000/socket',
      [],
      { minReconnectionDelay: 3000 }
    );
    socketRef.current.onopen = function () {
      setIsConnected(true);
      console.log('Connected');
    };
    socketRef.current.onclose = function () {
      console.log('closed');
      setIsConnected(false);
    };

    socketRef.current.onmessage = function (event) {
      setOnlinMatchStatuse(JSON.parse(event.data));
    };
  }, []);

  React.useEffect(() => {
    if (!onlinMatchStatus || !currentUser) return;
    if (
      onlinMatchStatus.joined_onine_match_user_ids != null &&
      onlinMatchStatus.joined_onine_match_user_ids.includes(
        String(currentUser.id)
      )
    ) {
      if (router.pathname != '/waiting_matching')
        router.push('/waiting_matching');
    }
  }, [onlinMatchStatus, currentUser, router]);

  if (!socketrefCurrent) return <></>;
  return (
    <WebSocketContext.Provider
      value={{
        socketrefCurrent,
        isConnected,
        onlinMatchStatus,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
