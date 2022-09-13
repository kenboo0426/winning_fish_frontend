import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useCurrentUser } from '../src/utils/userAuth';
import { WebSocketContext } from '../src/utils/webSocket';

const Home: React.FC = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { socketrefCurrent, onlinMatchStatus, isConnected } =
    React.useContext(WebSocketContext);

  const handleStartMatching = React.useCallback(() => {
    if (!currentUser) return;

    const jsonDate = {
      action: 'join_online_match',
      user_id: String(currentUser.id),
    };
    socketrefCurrent.send(JSON.stringify(jsonDate));
  }, [currentUser, socketrefCurrent]);

  const fetchJoinedUserIDs = React.useCallback(() => {
    if (!socketrefCurrent) return;
    const jsonDate = {
      action: 'fetch_joined_user',
    };
    socketrefCurrent.send(JSON.stringify(jsonDate));
  }, [socketrefCurrent]);

  // React.useEffect(() => {
  //   console.log("vvvvvvvvv")
  //   if (!onlinMatchStatus || !currentUser) return;
  //   if (
  //     onlinMatchStatus.joined_onine_match_user_ids != null &&
  //     onlinMatchStatus.joined_onine_match_user_ids.includes(
  //       String(currentUser.id)
  //     )
  //   ) {
  //     console.log("aaaaaaaaa")
  //     router.push('/waiting_matching');
  //   }
  // }, [onlinMatchStatus, currentUser, router]);

  if (!currentUser || !socketrefCurrent) return <></>;
  return (
    <div>
      {onlinMatchStatus?.joined_onine_match_user_ids?.map((id, index) => (
        <React.Fragment key={index}>id: {id}</React.Fragment>
      ))}
      <h1>WebSocket is connected : {`${isConnected}`}</h1>
      <Button onClick={handleStartMatching}>オンライン対戦をする</Button>
    </div>
  );
};

export default Home;
