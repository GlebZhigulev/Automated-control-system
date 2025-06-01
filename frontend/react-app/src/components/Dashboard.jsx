import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header.jsx'; // Импортируем Header
import Footer from './Footer.jsx'; // Импортируем Footer

const Dashboard = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'Гость';
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Верхнее меню через отдельный компонент */}
      <Header />

      {/* Основное содержимое */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">Добро пожаловать!</Typography>
        <Typography variant="subtitle1">Ваша роль: Администратор</Typography>
      </Box>

      {/* Нижний футер */}
      <Footer />
    </Box>
  );
};

export default Dashboard;
