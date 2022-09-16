import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { joinOrCreate } from '../src/api/online_match';
import { useShowError } from '../src/hooks/error';
import { useCurrentUser } from '../src/utils/userAuth';
import { WebSocketContext } from '../src/utils/webSocket';

const Home: React.FC = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const showError = useShowError();
  const { socketrefCurrent, onlinMatchStatus, isConnected } =
    React.useContext(WebSocketContext);

  const handleStartMatching = React.useCallback(async () => {
    if (!currentUser) return;

    try {
      const response = await joinOrCreate(currentUser.id);
      const jsonDate = {
        action: 'join_online_match',
        user_id: String(currentUser.id),
        user_name: currentUser.name,
      };
      socketrefCurrent.send(JSON.stringify(jsonDate));
      router.push(`/waiting_matching?online_match_id=${response.id}`);
    } catch (err) {
      showError(err);
    }
  }, [currentUser, socketrefCurrent, router, showError]);

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
      {onlinMatchStatus?.users?.map((user, index) => (
        <React.Fragment key={index}>
          id: {user.id}
          name: {user.name}
        </React.Fragment>
      ))}
      <h1>WebSocket is connected : {`${isConnected}`}</h1>
      <Button onClick={handleStartMatching}>オンライン対戦をする</Button>
    </div>
  );
};

export default Home;
