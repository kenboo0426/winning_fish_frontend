import {
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Box,
  CssBaseline,
  AppBar,
  Typography,
  IconButton,
  Drawer,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import React from 'react';
import {
  useCurrentUser,
  loginByGoogleAuth,
  signOutFromGoogleAuth,
} from '../../src/utils/userAuth';
import { NotificationStateContext } from './Notification';

const TopNavbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { setNotify } = React.useContext(NotificationStateContext);
  const currentUser = useCurrentUser();

  const handleCreateUser = React.useCallback(() => {
    loginByGoogleAuth();
  }, []);

  const handleSignout = React.useCallback(() => {
    signOutFromGoogleAuth();
    setNotify({
      type: 'success',
      message: 'ログアウトしました',
      open: true,
    });
  }, [setNotify]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          {currentUser ? (
            <ListItemButton onClick={handleSignout}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              ログアウト
            </ListItemButton>
          ) : (
            <ListItemButton onClick={handleCreateUser}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              ログイン
            </ListItemButton>
          )}
        </ListItem>
      </List>
      <Divider />
    </div>
  );

  return (
    <Box>
      <CssBaseline />
      <AppBar position="static" sx={{}}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            my: 2,
            mx: 2,
          }}
        >
          <Typography variant="h6" noWrap sx={{ ml: 2 }} component="div">
            Winning Fish
          </Typography>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Box>
      </AppBar>
      <Box component="nav" sx={{ flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default TopNavbar;
