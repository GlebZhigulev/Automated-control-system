import React from 'react';
import { Box, Typography, Paper, Grid, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const AnalystPanel = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Панель аналитика</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: 300, overflowY: 'auto' }}>
              <Typography variant="h6">Завершённые миссии</Typography>
              <ul>
                <li>Маршрут #1 — 2025-05-20</li>
                <li>Маршрут #2 — 2025-05-21</li>
                <li>Маршрут #3 — 2025-05-22</li>
              </ul>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="h6">Видеопроигрыватель</Typography>
              <Box sx={{ height: '80%', backgroundColor: '#eceff1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                [Здесь будет видео и таймлайн]
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, height: 300 }}>
              <Typography variant="h6">Карта дефектов</Typography>
              <Box sx={{ height: '85%', backgroundColor: '#cfd8dc', textAlign: 'center', pt: 5 }}>
                [Здесь будет карта с метками дефектов]
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Результаты анализа</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Тип дефекта</TableCell>
                    <TableCell>Координаты</TableCell>
                    <TableCell>Уверенность</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Трещина</TableCell>
                    <TableCell>59.93, 30.34</TableCell>
                    <TableCell>95%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Выбоина</TableCell>
                    <TableCell>59.94, 30.36</TableCell>
                    <TableCell>88%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Button variant="contained" sx={{ mt: 2 }}>Экспорт в PDF</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default AnalystPanel;
