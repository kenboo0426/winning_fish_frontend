import { useRouter } from 'next/router';
import React from 'react';
import { useCurrentUser } from '../src/utils/userAuth';
import { WebSocketContext } from '../src/utils/webSocket';

const WaitingMatchingPage: React.FC = () => {
  const { socketrefCurrent, onlinMatchStatus } =
    React.useContext(WebSocketContext);
  const router = useRouter();
  const currentUser = useCurrentUser();

  const fetchJoinedUserIDs = React.useCallback(() => {
    if (!socketrefCurrent || !currentUser) return;
    const jsonDate = {
      action: 'fetch_joined_user',
    };
    socketrefCurrent.send(JSON.stringify(jsonDate));
  }, [socketrefCurrent, currentUser]);

  React.useEffect(() => {
    fetchJoinedUserIDs();
  }, [fetchJoinedUserIDs]);

  return (
    <>
      {onlinMatchStatus?.joined_onine_match_user_ids?.map((id) => (
        <React.Fragment key={id}>id: {id}</React.Fragment>
      ))}
    </>
  );
};

export default WaitingMatchingPage;
