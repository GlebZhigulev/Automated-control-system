import React, { useState } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow,
  TableCell, TextField, MenuItem, Select, InputLabel, FormControl, Button
} from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';


const sampleReports = [
  {
    id: 1,
    route: 'Маршрут 1',
    operator: 'operator1',
    flightDate: '2025-06-05',
    createdAt: '2025-06-06',
    status: 'создан',
    fileUrl: '/assets/report1.pdf',
  },
  {
    id: 2,
    route: 'Маршрут 2',
    operator: 'operator2',
    flightDate: '2025-06-01',
    createdAt: '2025-06-02',
    status: 'обновлён',
    fileUrl: '/assets/report2.pdf',
  }
];

const ReportView = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  const filteredReports = [...sampleReports]
    .filter(r =>
      r.route.toLowerCase().includes(search.toLowerCase()) ||
      r.flightDate.includes(search)
    )
    .sort((a, b) => {
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'route') return a.route.localeCompare(b.route);
      return 0;
    });

  const openPDF = (url) => {
    window.open(url, '_blank');
  };

  const downloadPDF = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop();
    link.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <br />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Отчёты</Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Поиск по маршруту или дате"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Сортировать по</InputLabel>
            <Select
              value={sortBy}
              label="Сортировать по"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="createdAt">Дате создания</MenuItem>
              <MenuItem value="route">Маршруту</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Маршрут</TableCell>
                <TableCell>Оператор</TableCell>
                <TableCell>Дата полёта</TableCell>
                <TableCell>Дата отчёта</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map(report => (
                <TableRow key={report.id}>
                  <TableCell>{report.route}</TableCell>
                  <TableCell>{report.operator}</TableCell>
                  <TableCell>{report.flightDate}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>{report.status}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => openPDF(report.fileUrl)}>Просмотр</Button>
                    <Button size="small" onClick={() => downloadPDF(report.fileUrl)}>Скачать</Button>
                  </TableCell>
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

export default ReportView;
