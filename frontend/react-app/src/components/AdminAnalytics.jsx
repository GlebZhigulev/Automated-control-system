import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const sampleLogs = [
  { id: 1, user: 'admin', role: 'Администратор', action: 'Вход в систему', date: '2025-05-28T10:12:00', ip: '192.168.0.1', result: 'Успех' },
  { id: 2, user: 'operator1', role: 'Оператор', action: 'Выполнение полета по маршруту', date: '2025-05-28T11:05:00', ip: '192.168.0.2', result: 'Успех' },
  { id: 3, user: 'analyst', role: 'Аналитик', action: 'Просмотр отчета об анализе', date: '2025-05-27T17:45:00', ip: '192.168.0.3', result: 'Успех' },
];

const AdminAnalytics = () => {
  const [logs, setLogs] = useState(sampleLogs);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) ||
                          log.action.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? log.role === roleFilter : true;
    const matchesDate = dateFilter ? log.date.startsWith(dateFilter) : true;
    return matchesSearch && matchesRole && matchesDate;
  });

  const exportToCSV = () => {
    const header = 'Пользователь,Роль,Действие,Дата,IP,Результат';
    const rows = filteredLogs.map(log =>
      `${log.user},${log.role},${log.action},${log.date},${log.ip},${log.result}`
    );
    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Аналитика</Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField fullWidth label="Поиск по имени или действию" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Фильтр по роли</InputLabel>
              <Select value={roleFilter} label="Фильтр по роли" onChange={(e) => setRoleFilter(e.target.value)}>
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="Администратор">Администратор</MenuItem>
                <MenuItem value="Оператор">Оператор</MenuItem>
                <MenuItem value="Аналитик">Аналитик</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField fullWidth type="date" label="Фильтр по дате" InputLabelProps={{ shrink: true }} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
          </Grid>
        </Grid>

        <Paper sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Пользователь</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Действие</TableCell>
                <TableCell>Дата и время</TableCell>
                <TableCell>IP-адрес</TableCell>
                <TableCell>Результат</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.role}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.date}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>{log.result}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={exportToCSV}>
            Экспорт в CSV
          </Button>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default AdminAnalytics;
