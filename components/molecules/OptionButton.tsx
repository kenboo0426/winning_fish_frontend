import { Box, Typography, Button } from '@mui/material';
import React from 'react';
import { Option } from '../../src/interface';

type Props = {
  option_number: number;
  option: Option;
  onClick: (option_id: number) => void;
};

const OptionButton: React.FC<Props> = ({ option_number, option, onClick }) => {
  return (
    <Button
      onClick={() => onClick(option.id)}
      variant="outlined"
      sx={{
        width: '100%',
        my: 1,
        px: 1,
        background: 'linear-gradient(to bottom, #909092, white)',
        justifyContent: 'normal',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <Typography
          sx={{ color: 'black', fontSize: 25, fontWeight: 900 }}
          style={{
            borderRight: '3px dotted black',
            padding: '0.2em 0.5em 0.2em 0.2em',
          }}
        >
          {option_number + 1}
        </Typography>
        <Typography
          sx={{
            color: 'black',
            width: '100%',
            fontSize: 20,
            fontWeight: 900,
          }}
        >
          {option.name}
        </Typography>
      </Box>
    </Button>
  );
};

export default OptionButton;
