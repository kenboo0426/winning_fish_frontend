import { Badge, Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { joinOrCreate } from '../src/api/online_match';
import { useShowError } from '../src/hooks/error';
import { useCurrentUser } from '../src/utils/userAuth';
import { WebSocketContext } from '../src/utils/webSocket';
import Image from 'react-bootstrap/Image';

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
    <Box>
      <Box sx={{ display: 'flex', mt: 30, backgroundColor: 'white' }}>
        <Image
          style={{ width: 50, height: 50 }}
          alt=""
          src="/images/fish_shadow.png"
        />
        <Badge
          badgeContent={
            <Image
              style={{ width: 30, height: 30 }}
              alt=""
              src="/images/question.png"
            />
          }
        >
          <Typography
            style={{ fontFamily: 'Nico Moji' }}
            sx={{ ml: 2, fontSize: 35 }}
            component="div"
          >
            Winning Fish
          </Typography>
        </Badge>
      </Box>

      <Box
        sx={{
          flexDirection: 'column',
          display: 'flex',
          width: '80%',
          mt: 10,
          mx: 'auto',
        }}
      >
        <Button
          onClick={handleStartMatching}
          variant="contained"
          style={{
            backgroundColor: '#ed2121',
          }}
          size="large"
          sx={{
            my: 1,
            height: 80,
            fontSize: 20,
            border: '2mm ridge #29020299',
          }}
        >
          オンライン対戦をする
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#ababab',
          }}
          size="large"
          sx={{
            my: 1,
            height: 80,
            fontSize: 20,
            borderRadius: 0,
            border: '2mm ridge #14150399',
          }}
          // onClick={() => router.push('/setting')}
        >
          設定
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
