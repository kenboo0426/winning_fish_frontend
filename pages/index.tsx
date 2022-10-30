import { Badge, Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { joinOrCreate } from '../src/api/online_match';
import { useShowError } from '../src/hooks/error';
import { useCurrentUser, useCurrentUserLoading } from '../src/utils/userAuth';
import {
  WebSocketContext,
  WsRequestJoinOnlineMatch,
} from '../src/utils/webSocket';
import Image from 'react-bootstrap/Image';
import Cookie from 'js-cookie';
import { create as createUser } from '../src/api/user';

const Home: React.FC = () => {
  const currentUser = useCurrentUser();
  const isLoading = useCurrentUserLoading();
  const router = useRouter();
  const showError = useShowError();
  const { socketrefCurrent } = React.useContext(WebSocketContext);

  const handleStartMatching = React.useCallback(async () => {
    if (!currentUser && isLoading) return;

    try {
      const request_user_id = currentUser
        ? currentUser.id
        : Cookie.get('guest_user_id');
      const response = await joinOrCreate(request_user_id as string);
      let jsonData: WsRequestJoinOnlineMatch;
      if (currentUser) {
        jsonData = {
          action: 'join_online_match',
          user_id: String(currentUser.id),
          user_name: currentUser.name,
          remained_time: 0,
          user_icon: currentUser.icon,
          online_match_id: response.id,
        };
      } else {
        const params = {
          uuid: request_user_id as string,
          name: 'ゲスト',
          email: '',
          icon: '',
          role: 2,
        };
        const { data } = await createUser(params);
        jsonData = {
          action: 'join_online_match',
          user_id: String(data.id),
          user_name: 'ゲスト',
          remained_time: 0,
          user_icon: '',
          online_match_id: response.id,
        };
      }

      socketrefCurrent.send(JSON.stringify(jsonData));
      router.push(`/waiting_matching?online_match_id=${response.id}`);
    } catch (err) {
      showError(err);
    }
  }, [currentUser, isLoading, socketrefCurrent, router, showError]);

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
          ランダムマッチング
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#21cbed',
          }}
          size="large"
          sx={{
            my: 1,
            height: 80,
            fontSize: 20,
            border: '2mm ridge #14150399',
          }}
          onClick={() => router.push('/free_match')}
        >
          フリーマッチング
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
