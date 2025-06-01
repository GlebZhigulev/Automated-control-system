import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, MenuItem, Select, InputLabel, FormControl, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const sampleRoutes = [
  { id: 1, name: 'Маршрут 1', operator: 'Оператор А', drone: 'БПЛА-1', date: '2025-05-25' },
  { id: 2, name: 'Маршрут 2', operator: 'Оператор Б', drone: 'БПЛА-2', date: '2025-05-20' },
  { id: 3, name: 'Маршрут 3', operator: 'Оператор А', drone: 'БПЛА-3', date: '2025-05-27' }
];

const RouteHistory = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredRoutes = [...sampleRoutes]
    .filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.operator.toLowerCase().includes(search.toLowerCase()) ||
      r.drone.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'operator') return a.operator.localeCompare(b.operator);
      return 0;
    });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>История маршрутов</Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField fullWidth label="Поиск" value={search} onChange={(e) => setSearch(e.target.value)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Сортировать по</InputLabel>
              <Select value={sortBy} label="Сортировать по" onChange={(e) => setSortBy(e.target.value)}>
                <MenuItem value="date">Дате</MenuItem>
                <MenuItem value="name">Названию</MenuItem>
                <MenuItem value="operator">Оператору</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название маршрута</TableCell>
                <TableCell>Оператор</TableCell>
                <TableCell>БПЛА</TableCell>
                <TableCell>Дата выполнения</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoutes.map(route => (
                <TableRow key={route.id} hover style={{ cursor: 'pointer' }}>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>{route.operator}</TableCell>
                  <TableCell>{route.drone}</TableCell>
                  <TableCell>{route.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
};

export default RouteHistory;
