import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.js';
import { Button, TextField, Box, Typography } from '@mui/material';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      alert('Неверные данные пользователя');
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: '0 auto',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h4" component="h2" gutterBottom align="center">
        Вход в систему "Дорожный контроль"
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Имя пользователя"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          fullWidth
          label="Пароль"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
        >
          Войти
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
