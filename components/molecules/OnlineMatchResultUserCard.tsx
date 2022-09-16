import { Box, Typography, Button, CircularProgress } from '@mui/material';
import React from 'react';

type Props = {
  rank: number;
  userName?: string;
  remainedTime?: number;
  existUser: boolean;
};

const OnlineMatchResultUserCard: React.FC<Props> = ({
  rank,
  userName,
  remainedTime,
  existUser,
}) => {
  return (
    <Button
      variant="outlined"
      sx={{
        width: '100%',
        my: 2,
        px: 1,
        background: 'linear-gradient(to bottom, #909092, white)',
        justifyContent: 'normal',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Typography
          sx={{
            color: 'black',
            fontSize: 25,
            fontWeight: 900,
            textTransform: 'none',
          }}
          style={{
            borderRight: '3px dotted black',
            padding: '0.2em 0.5em 0.2em 0.2em',
          }}
        >
          {rank}
          {rank == 1 && 'st.'}
          {rank == 2 && 'nd.'}
          {rank == 3 && 'rd.'}
          {rank == 4 && 'th.'}
        </Typography>
        <Typography
          sx={{
            color: existUser ? 'black' : '#656567',
            width: '100%',
            fontSize: 20,
            fontWeight: 900,
          }}
        >
          {existUser ? userName : 'ユーザーなし'}
        </Typography>
        {existUser && remainedTime ? (
          <Typography
            sx={{
              color: 'black',
              width: '100%',
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            スコア：{remainedTime}点
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              ml: 2,
            }}
          >
            <Typography
              sx={{
                color: 'black',
                width: '100%',
                fontSize: 20,
                fontWeight: 900,
              }}
            >
              スコア：
            </Typography>
            <CircularProgress color="inherit" />
          </Box>
        )}
      </Box>
    </Button>
  );
};

export default OnlineMatchResultUserCard;
