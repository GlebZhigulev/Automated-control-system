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

        {/* Роль admin */}
        {userRole === 'admin' && (
          <>
          <Button color="inherit" onClick={() => navigate('/users')}>
            Пользователи
          </Button>
          <Button color="inherit" onClick={() => navigate('/users')}>
            Аналитика
          </Button>
          </>
        )}

        {/* Роль operator */}
        {userRole === 'operator' && (
          <>
            <Button color="inherit" onClick={() => navigate('/operator')}>
              Выполнение миссии
            </Button>
            <Button color="inherit" onClick={() => navigate('/routes')}>
              Планы полетов
            </Button>
          </>
        )}

        {/* Роль analyst */}
        {userRole === 'analyst' && (
          <>
            <Button color="inherit" onClick={() => navigate('/report')}>
              Анализ дефектов
            </Button>
            <Button color="inherit" onClick={() => navigate('/routes')}>
              Маршруты
            </Button>
            <Button color="inherit" onClick={() => navigate('/history')}>
              История маршрутов
            </Button>
          </>
        )}

        <Button color="inherit" onClick={handleLogout}>
          Выйти
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;