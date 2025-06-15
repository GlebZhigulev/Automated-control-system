import React, { useState } from 'react';
import {
  Box, Typography, TextField, MenuItem, Select, InputLabel, FormControl, Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import Header from './Header.jsx';

const mockLogs = [
  {
    id: 1,
    username: 'admin',
    role: 'администратор',
    action: 'вход в систему',
    timestamp: '2025-06-03 09:12:00',
    ip: '192.168.0.2',
    status: 'успешно',
  },
  {
    id: 2,
    username: 'operator1',
    role: 'оператор',
    action: 'Полет завершен',
    timestamp: '2025-06-03 10:10:30',
    ip: '192.168.0.10',
    status: 'успешно',
  },
  {
    id: 3,
    username: 'Системное действие',
    role: '',
    action: 'запуск анализа',
    timestamp: '2025-06-03 10:30:15',
    ip: '192.168.0.15',
    status: 'ошибка',
  },
];

const roles = ['администратор', 'оператор', 'аналитик'];

export default function AdminAnalytics() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredLogs = mockLogs.filter((log) =>
    log.username.toLowerCase().includes(search.toLowerCase()) &&
    (roleFilter ? log.role === roleFilter : true)
  );

  const columns = [
    { field: 'username', headerName: 'Имя пользователя', flex: 1 },
    { field: 'role', headerName: 'Роль', flex: 1 },
    { field: 'action', headerName: 'Действие', flex: 2 },
    { field: 'timestamp', headerName: 'Дата и время', flex: 1.5 },
    { field: 'ip', headerName: 'IP-адрес', flex: 1 },
    { field: 'status', headerName: 'Статус', flex: 1 },
  ];

  const exportToCSV = () => {
    const csv = [
      ['Имя пользователя', 'Роль', 'Действие', 'Дата и время', 'IP-адрес', 'Статус'],
      ...filteredLogs.map((log) => [
        log.username,
        log.role,
        log.action,
        log.timestamp,
        log.ip,
        log.status,
      ]),
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'logs.csv');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Header/>
      <br />
      <Typography variant="h4" gutterBottom>Аналитика</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Поиск по имени"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Фильтр по роли</InputLabel>
          <Select
            value={roleFilter}
            label="Фильтр по роли"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={exportToCSV}>
          Экспорт в CSV
        </Button>
      </Box>

      <DataGrid
        autoHeight
        rows={filteredLogs}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
}
