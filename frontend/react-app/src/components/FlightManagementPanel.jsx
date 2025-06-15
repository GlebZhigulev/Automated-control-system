import React, { useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { format } from 'date-fns';
import Header from './Header.jsx';

const FlightManagementPanel = () => {
  const [flights, setFlights] = useState([
    {
      id: 1,
      route: 'Маршрут А',
      operator: 'Оператор 1',
      date: '2025-06-08T10:00:00',
      status: 'запланирован',
    },
    {
      id: 2,
      route: 'Маршрут B',
      operator: 'Оператор 2',
      date: '2025-06-06T15:30:00',
      status: 'выполнен',
    },
    {
      id: 3,
      route: 'Маршрут C',
      operator: 'Оператор 3',
      date: '2025-06-07T09:00:00',
      status: 'отменён',
    },
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newFlight, setNewFlight] = useState({
    route: '',
    operator: '',
    date: '',
    status: 'запланирован',
  });

  const handleCreate = () => {
    setFlights(prev => [...prev, { ...newFlight, id: Date.now() }]);
    setOpenDialog(false);
    setNewFlight({ route: '', operator: '', date: '', status: 'запланирован' });
  };

  const filteredFlights = flights
    .filter(f =>
      (f.route.toLowerCase().includes(search.toLowerCase()) ||
      f.operator.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || f.status === statusFilter)
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Box p={3}>
        <Header/>
        <br />
      <Typography variant="h4" gutterBottom>Управление полётами</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Поиск"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            label="Статус"
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="запланирован">Запланирован</MenuItem>
            <MenuItem value="выполнен">Выполнен</MenuItem>
            <MenuItem value="отменён">Отменён</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Создать вылет
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Маршрут</TableCell>
              <TableCell>Оператор</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredFlights.map(flight => (
              <TableRow key={flight.id}>
                <TableCell>{flight.route}</TableCell>
                <TableCell>{flight.operator}</TableCell>
                <TableCell>{format(new Date(flight.date), 'yyyy-MM-dd HH:mm')}</TableCell>
                <TableCell>{flight.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Создание вылета</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Маршрут"
            value={newFlight.route}
            onChange={e => setNewFlight({ ...newFlight, route: e.target.value })}
          />
          <TextField
            label="Оператор"
            value={newFlight.operator}
            onChange={e => setNewFlight({ ...newFlight, operator: e.target.value })}
          />
          <TextField
            type="datetime-local"
            label="Дата"
            InputLabelProps={{ shrink: true }}
            value={newFlight.date}
            onChange={e => setNewFlight({ ...newFlight, date: e.target.value })}
          />
          <FormControl>
            <InputLabel>Статус</InputLabel>
            <Select
              value={newFlight.status}
              onChange={e => setNewFlight({ ...newFlight, status: e.target.value })}
              label="Статус"
            >
              <MenuItem value="запланирован">Запланирован</MenuItem>
              <MenuItem value="выполнен">Выполнен</MenuItem>
              <MenuItem value="отменён">Отменён</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FlightManagementPanel;
