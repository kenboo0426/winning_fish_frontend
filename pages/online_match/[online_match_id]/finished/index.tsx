import { useRouter } from 'next/router';
import React from 'react';
import { calculateTime, joinOrCreate } from '../../../../src/api/online_match';
import { useShowError } from '../../../../src/hooks/error';
import { OnlineMatch } from '../../../../src/interface';
import { useCurrentUser } from '../../../../src/utils/userAuth';
import { WebSocketContext } from '../../../../src/utils/webSocket';
import { Box, Button } from '@mui/material';

const OnlineMatchFinishedPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const showError = useShowError();
  const { question, online_match_id } = router.query;
  const [onlineMatch, setOnlineMatch] = React.useState<OnlineMatch>();
  const { socketrefCurrent, onlinMatchStatus, isConnected } =
    React.useContext(WebSocketContext);

  const calculateRemainedTime = React.useCallback(async () => {
    console.log('aaaa');
    if (!online_match_id || !currentUser) return;

    try {
      const response = await calculateTime(
        online_match_id as string,
        currentUser.id
      );
      setOnlineMatch(response);
    } catch (err) {
      showError(err);
    }
  }, [online_match_id, currentUser, showError]);

  console.log(onlineMatch?.online_match_joined_users, 'onlineMatch');

  const handleFinishedMatching = React.useCallback(async () => {
    if (!currentUser) return;

    try {
      const jsonDate = {
        action: 'join_online_match',
        user_id: String(currentUser.id),
        user_name: currentUser.name,
      };
      socketrefCurrent.send(JSON.stringify(jsonDate));
    } catch (err) {
      showError(err);
    }
  }, [currentUser, socketrefCurrent, showError]);

  React.useEffect(() => {
    calculateRemainedTime();
  }, [calculateRemainedTime, onlinMatchStatus]);

  React.useEffect(() => {
    handleFinishedMatching();
  }, [handleFinishedMatching]);

  return (
    <>
      <Box sx={{ mt: 4 }}>
        {onlineMatch?.online_match_joined_users?.map((user) => (
          <Box key={user.id}>スコア：{user.remained_time}</Box>
        ))}
      </Box>
    </>
  );
};

export default OnlineMatchFinishedPage;
