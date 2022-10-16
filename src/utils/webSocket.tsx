import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { OnlineMatch } from '../interface';
import { useCurrentUser } from './userAuth';

export const WebSocketContext = React.createContext<WebSocketStatus>(
  {} as WebSocketStatus
);

export type WsUser = {
  id: number;
  name: string;
  remained_time: number;
  icon: string;
};

type WsJsonResponse = {
  action: string;
  joined_onine_match_user_ids: string[];
  users: WsUser[];
  online_match: OnlineMatch;
};

export type WsRequestJoinOnlineMatch = {
  action: string;
  user_id: string;
  user_name: string;
  remained_time: number;
  user_icon: string;
  online_match_id: number;
};

export type WsRequestStartOnlineMatch = {
  action: string;
  online_match_id: number;
};

export type WsRequestFetchJoinedUser = {
  action: string;
  online_match_id: number;
};

export type WsRequestFinishedOnlineMatch = {
  action: string;
  user_id: string;
  user_name: string;
  remained_time: number;
  user_icon: string;
  online_match_id: number;
};

export type WsRequestLeft = {
  action: string;
  online_match_id: number;
};

type Props = {
  children: React.ReactNode;
};

type WebSocketStatus = {
  socketrefCurrent: ReconnectingWebSocket;
  isConnected: boolean;
  setIsConnected: (isConnected: boolean) => void;
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
      `${process.env.NEXT_PUBLIC_BACKEND_WS_URL}/socket` ||
        'ws://localhost:3000/socket',
      [],
      { minReconnectionDelay: 3000 }
    );
    socketRef.current.onopen = function () {
      console.log('connected');
      setIsConnected(true);
    };
    socketRef.current.onclose = function () {
      console.log('closed');
      setIsConnected(false);
    };

    socketRef.current.onerror = function (error) {
      console.log(error, 'error');
    };

    socketRef.current.onmessage = function (event) {
      console.log('receive message');
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
  }, [onlinMatchStatus, currentUser, router, isConnected]);

  if (!socketrefCurrent) return <></>;
  return (
    <WebSocketContext.Provider
      value={{
        socketrefCurrent,
        isConnected,
        setIsConnected,
        onlinMatchStatus,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
