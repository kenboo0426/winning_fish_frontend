import { Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { show, start } from '../src/api/online_match';
import { useShowError } from '../src/hooks/error';
import { OnlineMatch } from '../src/interface';
import { useCurrentUser } from '../src/utils/userAuth';
import { WebSocketContext } from '../src/utils/webSocket';

const WaitingMatchingPage: React.FC = () => {
  const { socketrefCurrent, onlinMatchStatus } =
    React.useContext(WebSocketContext);
  const router = useRouter();
  const { online_match_id } = router.query;
  const currentUser = useCurrentUser();
  const [onlineMatch, setOnlineMatch] = React.useState<OnlineMatch>();
  const showError = useShowError();

  const fetchJoinedUserIDs = React.useCallback(() => {
    if (!socketrefCurrent || !currentUser) return;
    const jsonDate = {
      action: 'fetch_joined_user',
    };
    socketrefCurrent.send(JSON.stringify(jsonDate));
  }, [socketrefCurrent, currentUser]);

  const fetchOnlineMatch = React.useCallback(async () => {
    if (!online_match_id) return;

    try {
      const response = await show(online_match_id as string);
      setOnlineMatch(response);
    } catch (err) {
      showError(err);
    }
  }, [online_match_id, showError]);

  const startOnlineMatch = React.useCallback(async () => {
    if (!online_match_id) return;

    try {
      const response = await start(online_match_id as string);
      setOnlineMatch(response);
      router.push(`/online_match/${online_match_id}/quiz?question=1`);
    } catch (err) {
      showError(err);
    }
  }, [showError, router, online_match_id]);

  React.useEffect(() => {
    fetchJoinedUserIDs();
  }, [fetchJoinedUserIDs]);

  console.log(onlinMatchStatus, 'onlinMatchStatus');
  React.useEffect(() => {
    fetchOnlineMatch();
  }, [fetchOnlineMatch]);

  return (
    <>
      <Box sx={{ width: '80%', mt: 5 }}>
        {[...Array(4)].map((_, index) => {
          let user;
          if (onlinMatchStatus?.users) {
            user = onlinMatchStatus?.users[index];
          }
          return (
            <Box key={index} sx={{ width: '80%', border: '1px solid grey' }}>
              <React.Fragment>
                {index + 1}. id: {user?.id}
                name: {user?.name}
              </React.Fragment>
            </Box>
          );
        })}
      </Box>
      <Button variant="contained" sx={{ mt: 5 }} onClick={startOnlineMatch}>
        対戦相手を待たずに開始する
        <br></br>※誰か一人でも押した場合に対戦は開始されます
      </Button>
    </>
  );
};

export default WaitingMatchingPage;
