import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, TextField, List, ListItem, ListItemText } from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const RouteManager = () => {
  const mapRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [maxDistance, setMaxDistance] = useState(0);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [59.9343, 30.3351],
          zoom: 13,
          controls: ['zoomControl']
        });

        const geoObjects = new window.ymaps.GeoObjectCollection();
        map.geoObjects.add(geoObjects);

        let currentPoints = [];

        map.events.add('click', (e) => {
          const coords = e.get('coords');
          currentPoints.push(coords);

          const placemark = new window.ymaps.Placemark(coords, {
            balloonContent: `Точка ${currentPoints.length}`
          }, {
            preset: 'islands#blueStretchyIcon'
          });
          geoObjects.add(placemark);

          if (currentPoints.length > 1) {
            const line = new window.ymaps.Polyline(currentPoints, {}, {
              strokeColor: '#0000FF',
              strokeWidth: 3
            });
            geoObjects.removeAll();
            currentPoints.forEach((pt, idx) => {
              geoObjects.add(new window.ymaps.Placemark(pt, {
                balloonContent: `Точка ${idx + 1}`
              }, {
                preset: 'islands#blueStretchyIcon'
              }));
            });
            geoObjects.add(line);
          }

          let total = 0;
          for (let i = 1; i < currentPoints.length; i++) {
            total += window.ymaps.coordSystem.geo.getDistance(currentPoints[i - 1], currentPoints[i]);
          }
          setTotalDistance((total / 1000).toFixed(2));

          let max = 0;
          if (currentPoints.length > 1) {
            for (let i = 1; i < currentPoints.length; i++) {
              const dist = window.ymaps.coordSystem.geo.getDistance(currentPoints[0], currentPoints[i]);
              if (dist > max) max = dist;
            }
          }
          setMaxDistance((max / 1000).toFixed(2));

          setPoints([...currentPoints]);
        });
      });
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>Управление маршрутами</Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: 300, overflowY: 'auto' }}>
              <Typography variant="h6">Список маршрутов</Typography>
              <List>
                <ListItem secondaryAction={<Button variant="contained" size="small">Удалить</Button>}>
                  <ListItemText primary="Маршрут #1" secondary="10 точек" />
                </ListItem>
                <ListItem secondaryAction={<Button variant="contained" size="small">Удалить</Button>}>
                  <ListItemText primary="Маршрут #2" secondary="8 точек" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Создание маршрута</Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <TextField label="Название маршрута" fullWidth />
                <Button variant="contained">Создать</Button>
              </Box>
              <Box sx={{ mt: 3, height: 250 }}>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Typography>Общая длина маршрута: <strong>{totalDistance} км</strong></Typography>
                <Typography>Макс. удалённость от начальной точки: <strong>{maxDistance} км</strong></Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Координаты точек:</Typography>
                <List dense>
                  {points.map((p, i) => (
                    <ListItem key={i}><ListItemText primary={`Точка ${i + 1}: ${p[0].toFixed(6)}, ${p[1].toFixed(6)}`} /></ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default RouteManager;