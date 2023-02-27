import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useShowError } from '../../src/hooks/error';

type Props = {
  isOpen: boolean;
  closeDialog: () => void;
};

const SearchRoomDialog: React.FC<Props> = ({ isOpen, closeDialog }) => {
  const showError = useShowError();
  const [inputRoomID, setInputRoomID] = React.useState('');

  const handleSearch = React.useCallback(() => {
    try {
    } catch (err) {
      showError(err);
    }
  }, [showError]);

  const handleChangeInputRoomID = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setInputRoomID(e.target.value);
    },
    []
  );

  return (
    <>
      <Dialog open={isOpen} onClose={closeDialog}>
        <DialogTitle>ルームID入力</DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 0.1 }}>
            <FilledInput
              type="text"
              placeholder="入室するルームIDを入力"
              value={inputRoomID}
              onChange={(e) => handleChangeInputRoomID(e)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchRoomDialog;
