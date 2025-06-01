import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Grid, Table, TableHead, TableRow, TableCell, TableBody, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const routeInfo = {
  name: 'Маршрут 1',
  operator: 'Оператор А',
  drone: 'БПЛА-1',
  date: '2025-05-25',
  coords: [
    [59.9343, 30.3351],
    [59.9360, 30.3382],
    [59.9375, 30.3421]
  ]
};

const defects = [
  { id: 1, coords: [59.9351, 30.3360], image: 'https://via.placeholder.com/400x300?text=Defect+1' },
  { id: 2, coords: [59.9368, 30.3400], image: 'https://via.placeholder.com/400x300?text=Defect+2' }
];

const ReportView = () => {
  const mapRef = useRef(null);
  const [openImage, setOpenImage] = useState(null);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, {
          center: routeInfo.coords[0],
          zoom: 14,
          controls: ['zoomControl']
        });

        const routeLine = new window.ymaps.Polyline(routeInfo.coords, {}, {
          strokeColor: '#0000FF',
          strokeWidth: 4
        });
        map.geoObjects.add(routeLine);

        defects.forEach(defect => {
          const marker = new window.ymaps.Placemark(defect.coords, {
            balloonContent: `Дефект ID: ${defect.id}`
          }, {
            preset: 'islands#redIcon'
          });
          map.geoObjects.add(marker);
        });
      });
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Отчёт по маршруту</Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Общая информация</Typography>
          <Typography>Название маршрута: <strong>{routeInfo.name}</strong></Typography>
          <Typography>Оператор: <strong>{routeInfo.operator}</strong></Typography>
          <Typography>БПЛА: <strong>{routeInfo.drone}</strong></Typography>
          <Typography>Дата выполнения: <strong>{routeInfo.date}</strong></Typography>
        </Paper>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Карта маршрута</Typography>
          <Box sx={{ height: 300 }}>
            <div ref={mapRef} id="yandex-map-report" style={{ width: '100%', height: '100%' }} />
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Список дефектов</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Координаты</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {defects.map(defect => (
                <TableRow key={defect.id}>
                  <TableCell>{defect.id}</TableCell>
                  <TableCell>{defect.coords[0]}, {defect.coords[1]}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => setOpenImage(defect.image)}>Показать изображение</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        <Dialog open={!!openImage} onClose={() => setOpenImage(null)} maxWidth="md">
          <DialogTitle>Изображение дефекта</DialogTitle>
          <DialogContent>
            <img src={openImage} alt="Defect" style={{ width: '100%', height: 'auto' }} />
          </DialogContent>
        </Dialog>
      </Box>

      <Footer />
    </Box>
  );
};

export default ReportView;
