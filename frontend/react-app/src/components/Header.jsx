import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';


const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userRole = user?.role || 'Гость';

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Панель управления
        </Typography>
        {userRole === 'admin' && (
          <Button color="inherit" onClick={() => navigate('/users')}>
            Настройки операторов
          </Button>
        )}
        <Button color="inherit" onClick={handleLogout}>
          Выйти
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
