import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, TextField, Box } from '@mui/material';
import { fetchOperators, addOperator, deleteOperator } from '../utils/api.js';
import Header from './Header.jsx'; // Импортируем Header
import Footer from './Footer.jsx'; // Импортируем Footer
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [operators, setOperators] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadOperators();
  }, []);

  const loadOperators = async () => {
    try {
      const data = await fetchOperators();
      setOperators(data);
    } catch (error) {
      console.error('Ошибка при загрузке операторов:', error);
    }
  };

  const handleAddOperator = async () => {
    if (!newUsername || !newPassword) {
      alert('Заполните все поля!');
      return;
    }
    try {
      await addOperator(newUsername, newPassword);
      setNewUsername('');
      setNewPassword('');
      loadOperators();
    } catch (error) {
      console.error('Ошибка при добавлении оператора:', error);
    }
  };

  const handleDeleteOperator = async (id) => {
    try {
      await deleteOperator(id);
      loadOperators();
    } catch (error) {
      console.error('Ошибка при удалении оператора:', error);
    }
  };

  return (
    <Container>
    <Header />
      <Typography variant="h4" sx={{ mb: 2 }}>Управление операторами</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField label="Имя пользователя" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
        <TextField label="Пароль" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <Button variant="contained" onClick={handleAddOperator}>Добавить</Button>
      </Box>

      <List>
        {operators.map((operator) => (
          <ListItem key={operator.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={operator.username} secondary={`Роль: ${operator.role}`} />
            <Button variant="contained" color="error" onClick={() => handleDeleteOperator(operator.id)}>Удалить</Button>
          </ListItem>
        ))}
      </List>
      <Footer />
    </Container>
    
  );
};

export default AdminPanel;
