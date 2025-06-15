import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const initialDrones = [
  {
    id: 1,
    name: 'БПЛА-1',
    model: 'DJI M300 RTK',
    serial_number: 'M300SN001',
    status: 'available',
    created_at: '2025-05-01T12:00:00',
  },
  {
    id: 2,
    name: 'БПЛА-2',
    model: 'Autel Evo II',
    serial_number: 'AE2024XYZ',
    status: 'maintenance',
    created_at: '2025-05-10T09:30:00',
  }
];

const DroneManager = () => {
  const [drones, setDrones] = useState(initialDrones);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ name: '', model: '', serial_number: '', status: 'available' });

  const handleOpen = (index = null) => {
    setEditIndex(index);
    if (index !== null) {
      setForm(drones[index]);
    } else {
      setForm({ name: '', model: '', serial_number: '', status: 'available' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updated = [...drones];
      updated[editIndex] = { ...form };
      setDrones(updated);
    } else {
      const newDrone = {
        ...form,
        id: drones.length + 1,
        created_at: new Date().toISOString(),
      };
      setDrones([...drones, newDrone]);
    }
    handleClose();
  };

  const handleDelete = (index) => {
    if (window.confirm('Вы уверены, что хотите удалить этот БПЛА?')) {
      const updated = drones.filter((_, i) => i !== index);
      setDrones(updated);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Управление БПЛА</Typography>

        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Добавить БПЛА
        </Button>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Модель</TableCell>
                <TableCell>Серийный номер</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Дата добавления</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {drones.map((drone, index) => (
                <TableRow key={drone.id}>
                  <TableCell>{drone.name}</TableCell>
                  <TableCell>{drone.model}</TableCell>
                  <TableCell>{drone.serial_number}</TableCell>
                  <TableCell>{drone.status}</TableCell>
                  <TableCell>{new Date(drone.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(index)}><Edit /></IconButton>
                    <IconButton onClick={() => handleDelete(index)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? 'Редактировать БПЛА' : 'Добавить БПЛА'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Название"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Модель"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Серийный номер"
            value={form.serial_number}
            onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
            fullWidth margin="normal"
          />
          <TextField
            label="Статус"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            fullWidth margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSave} variant="contained">Сохранить</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default DroneManager;
