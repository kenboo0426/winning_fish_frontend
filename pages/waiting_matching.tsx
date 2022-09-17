import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { start } from '../src/api/online_match';
import { useShowError } from '../src/hooks/error';
import { WebSocketContext } from '../src/utils/webSocket';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCurrentUser } from '../src/utils/userAuth';

const WaitingMatchingPage: React.FC = () => {
  const { socketrefCurrent, onlinMatchStatus } =
    React.useContext(WebSocketContext);
  const router = useRouter();
  const currentUser = useCurrentUser();
  const { online_match_id } = router.query;
  const showError = useShowError();

  const startOnlineMatch = React.useCallback(async () => {
    if (!online_match_id) return;

    try {
      await start(online_match_id as string);
      router.push(`/online_match/${online_match_id}/quiz?question=1`);
    } catch (err) {
      showError(err);
    }
  }, [showError, router, online_match_id]);

  const handleCancelOnlineMatch = React.useCallback(() => {
    if (!currentUser) return;

    const jsonDate = {
      action: 'left',
      user_id: String(currentUser.id),
      user_name: currentUser.name,
    };
    socketrefCurrent.send(JSON.stringify(jsonDate));
    router.push('/');
  }, [currentUser, socketrefCurrent, router]);

  return (
    <>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          bgcolor: 'white',
          width: '50%',
          ml: 2,
          mt: 2,
          px: 2,
          py: 1,
        }}
      >
        <IconButton component="label" onClick={handleCancelOnlineMatch}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ ml: 2 }}>参加者受付中</Typography>
      </Box>
      <Box sx={{ width: '90%', mt: 5, mx: 'auto' }}>
        {[...Array(4)].map((_, index) => {
          let user;
          if (onlinMatchStatus?.users) {
            user = onlinMatchStatus?.users[index];
          }
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                my: 2,
                height: 80,
              }}
            >
              <Avatar
                variant="square"
                src={user?.icon}
                sx={{ width: 80, height: 80 }}
              />
              <Box
                key={index}
                sx={{
                  bgcolor: '#dbd9d9',
                  ml: 1,
                  width: '100%',
                  height: '100%',
                  border: '1mm ridge #29020299',
                }}
              >
                {user ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      ml: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: 20 }}>
                      {index + 1}P: {user?.name}
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      ml: 2,
                    }}
                  >
                    <CircularProgress color="inherit" />
                    <Typography sx={{ ml: 2, fontSize: 20 }}>
                      参加者受付中
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box sx={{ width: '90%', mx: 'auto' }}>
        <Box sx={{ display: 'flex', mt: 5, justifyContent: 'space-around' }}>
          <Button
            variant="contained"
            onClick={handleCancelOnlineMatch}
            color="error"
            sx={{ border: '1mm ridge #14150399' }}
          >
            キャンセル
          </Button>
          <Button
            color="success"
            variant="contained"
            onClick={startOnlineMatch}
            sx={{ border: '1mm ridge #14150399' }}
          >
            参加者を待たずにスタート
          </Button>
        </Box>
        <Typography
          sx={{
            mt: 2,
            fontSize: 15,
            fontWeight: 'bold',
          }}
          color="error"
        >
          ※誰か一人でもスタートした場合は自動的に開始されます
        </Typography>
      </Box>
    </>
  );
};

export default WaitingMatchingPage;
