import { useRouter } from 'next/router';
import React from 'react';
import { calculateTime, finish } from '../../../../src/api/online_match';
import { useShowError } from '../../../../src/hooks/error';
import { OnlineMatch } from '../../../../src/interface';
import { useCurrentUser } from '../../../../src/utils/userAuth';
import { WebSocketContext } from '../../../../src/utils/webSocket';
import { Box, Typography, Button } from '@mui/material';
import OnlineMatchResultUserCard from '../../../../components/molecules/OnlineMatchResultUserCard';

const OnlineMatchFinishedPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const router = useRouter();
  const showError = useShowError();
  const { online_match_id } = router.query;
  const [onlineMatch, setOnlineMatch] = React.useState<OnlineMatch>();
  const { socketrefCurrent, onlinMatchStatus, isConnected } =
    React.useContext(WebSocketContext);

  const calculateRemainedTime = React.useCallback(async () => {
    if (!online_match_id || !currentUser) return;

    try {
      const response = await calculateTime(
        online_match_id as string,
        currentUser.id
      );
      setOnlineMatch(response);
      const user = response.online_match_joined_users.find(
        (user) => user.user_id == currentUser.id
      );
      if (!user) return;

      const jsonDate = {
        action: 'finished_online_match',
        user_id: String(currentUser.id),
        user_name: currentUser.name,
        remained_time: user.remained_time,
      };
      socketrefCurrent.send(JSON.stringify(jsonDate));
    } catch (err) {
      showError(err);
    }
  }, [online_match_id, currentUser, socketrefCurrent, showError]);

  const handleRedirectToHome = React.useCallback(() => {
    router.push('/');
  }, [router]);

  const handlefinishOnlineMatch = React.useCallback(async () => {
    if (!online_match_id) return;

    try {
      const response = await finish(online_match_id as string);
      setOnlineMatch(response);
    } catch (err) {
      showError(err);
    }
  }, [showError, online_match_id]);

  React.useEffect(() => {
    calculateRemainedTime();
  }, [calculateRemainedTime]);

  React.useEffect(() => {
    if (!onlinMatchStatus?.users || !onlineMatch?.online_match_joined_users)
      return;

    if (
      onlinMatchStatus.users.length ==
        onlineMatch.online_match_joined_users.length &&
      onlineMatch.status != 'finished'
    ) {
      handlefinishOnlineMatch();
    }
  }, [handlefinishOnlineMatch, onlineMatch, onlinMatchStatus]);

  const sortUsers = () => {
    onlinMatchStatus?.users?.map((user) => {
      onlineMatch?.online_match_joined_users?.forEach((joined_user) => {
        if (joined_user.user_id == user.id) {
          joined_user.remained_time = user.remained_time;
        }
      });
    });
    onlineMatch?.online_match_joined_users?.sort((first, second) =>
      first.remained_time > second.remained_time ? -1 : 1
    );
    return onlineMatch?.online_match_joined_users;
  };

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'black',
            fontSize: 35,
            fontWeight: 900,
          }}
        >
          結果発表
        </Typography>
        <Box sx={{ mt: 3, width: '90%', mx: 'auto' }}>
          {[...Array(4)].map((_, index) => {
            const sortedUsers = sortUsers();
            const joined_user = sortedUsers?.[index];

            return (
              <OnlineMatchResultUserCard
                key={index}
                rank={index + 1}
                userName={joined_user?.user?.name}
                remainedTime={joined_user?.remained_time}
                existUser={!!joined_user}
              />
            );
          })}
        </Box>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Button
            color="success"
            variant="contained"
            onClick={handleRedirectToHome}
            sx={{
              border: '1mm ridge #14150399',
              width: 250,
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            ホームへ戻る
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default OnlineMatchFinishedPage;
