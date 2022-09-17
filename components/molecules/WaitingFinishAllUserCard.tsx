import { Box, Typography, Button, CircularProgress } from '@mui/material';
import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

type Props = {
  player_number: number;
  userName?: string;
  remainedTime?: number;
  existUser: boolean;
};

const WaitingFinishAllUserCard: React.FC<Props> = ({
  player_number,
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
          {player_number}P.
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
        {existUser && !remainedTime && <CircularProgress color="inherit" />}
        {existUser && remainedTime && <CheckCircleOutlineIcon />}
      </Box>
    </Button>
  );
};

export default WaitingFinishAllUserCard;
