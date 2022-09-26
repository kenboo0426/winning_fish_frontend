import { Paper, Box, Typography } from '@mui/material';
import React from 'react';

const SuggestOpenByMobile: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: 600,
            height: 200,
            p: 4,
            display: 'table',
            borderRadius: 4,
          }}
        >
          <Typography
            sx={{
              display: 'table-cell',
              fontWeight: 'bold',
              fontSize: 20,
              verticalAlign: 'middle',
              height: '100%',
            }}
          >
            現在PCではご利用できません。モバイル端末からご利用ください。
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default SuggestOpenByMobile;
