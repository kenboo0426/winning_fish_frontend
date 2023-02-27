import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Divider,
  Switch,
  TextField,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React from 'react';
import { useShowError } from '../../src/hooks/error';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { create, join } from '../../src/api/online_match';
import { useCurrentUser } from '../../src/utils/userAuth';
import { useRouter } from 'next/router';
import {
  WebSocketContext,
  WsRequestJoinOnlineMatch,
} from '../../src/utils/webSocket';
import Cookie from 'js-cookie';

type RoomSettingOption = {
  room_id: string;
  room_password: string;
  with_bot: boolean;
  question_number: number;
  max_participate_number: number;
};

type Props = {
  isOpen: boolean;
  closeDialog: () => void;
};

const RoomSettingDialog: React.FC<Props> = ({ isOpen, closeDialog }) => {
  const currentUser = useCurrentUser();
  const { socketrefCurrent } = React.useContext(WebSocketContext);
  const showError = useShowError();
  const router = useRouter();
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      room_id: '',
      room_password: '',
      with_bot: false,
      question_number: 5,
      max_participate_number: 2,
    },
  });

  const onSubmit: SubmitHandler<RoomSettingOption> = React.useCallback(
    async (data) => {
      try {
        const params = {
          room_id: data.room_id,
          room_password: data.room_password,
          with_bot: data.with_bot,
          question_number: data.question_number,
          max_participate_number: data.max_participate_number,
        };
        const response = await create(params);
        const request_user_id = currentUser
          ? currentUser.id
          : Cookie.get('guest_user_id');
        await join(response.id.toString(), request_user_id as string);
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
          jsonData = {
            action: 'join_online_match',
            user_id: '0', // ここバグあるかも ゲストでもcurrentUser存在したっけ？
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
    },
    [showError, router, socketrefCurrent, currentUser]
  );

  if (!socketrefCurrent) return <></>;
  return (
    <>
      <Dialog open={isOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>対戦ルール設定</DialogTitle>
          <DialogContent>
            <Controller
              name="room_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Box
                  sx={{
                    my: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography>ルームID</Typography>
                  <TextField
                    sx={{ maxWidth: '60%' }}
                    placeholder="winning_fish"
                    {...field}
                  />
                </Box>
              )}
            />
            <Controller
              name="room_password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Box
                  sx={{
                    my: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography>ルームパスワード</Typography>
                  <TextField
                    sx={{ maxWidth: '60%' }}
                    placeholder="password"
                    {...field}
                  />
                </Box>
              )}
            />
            <Divider sx={{ border: '0.5px solid' }} />
            <Controller
              name="question_number"
              control={control}
              rules={{ required: true, max: 10 }}
              render={({ field }) => (
                <Box
                  sx={{
                    my: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography>出題問題数(最大10問)</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <RemoveCircleOutlineIcon
                      onClick={() =>
                        setValue('question_number', field.value - 1)
                      }
                    />
                    <Typography>{field.value}</Typography>
                    <AddCircleOutlineIcon
                      onClick={() =>
                        setValue('question_number', field.value + 1)
                      }
                    />
                  </Box>
                </Box>
              )}
            />
            <Divider sx={{ border: '0.5px solid' }} />
            <Controller
              name="max_participate_number"
              control={control}
              rules={{ required: true, max: 4 }}
              render={({ field }) => (
                <Box
                  sx={{
                    my: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography>最大参加人数(最大4人)</Typography>
                  <Box sx={{ display: 'flex' }}>
                    <RemoveCircleOutlineIcon
                      onClick={() =>
                        setValue('max_participate_number', field.value - 1)
                      }
                    />
                    <Typography>{field.value}</Typography>
                    <AddCircleOutlineIcon
                      onClick={() =>
                        setValue('max_participate_number', field.value + 1)
                      }
                    />
                  </Box>
                </Box>
              )}
            />
            <Divider sx={{ border: '0.5px solid' }} />
            <Controller
              name="with_bot"
              control={control}
              render={({ field }) => (
                <Box
                  sx={{
                    my: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography>CPUの有無</Typography>
                  <Switch />
                </Box>
              )}
            />
            <Divider sx={{ border: '0.5px solid' }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>キャンセル</Button>
            <Button type="submit">作成</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default RoomSettingDialog;
