import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, Paper, Grid, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const OperatorPanel = () => {
  const [selectedRoute, setSelectedRoute] = useState('Маршрут #1');
  const [assignedDrone, setAssignedDrone] = useState('БПЛА-3');
  const [droneStatus, setDroneStatus] = useState('Доступен');
  const mapRef = useRef(null);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, {
          center: [59.9343, 30.3351],
          zoom: 14,
          controls: ['zoomControl']
        });

const routePoints = [
  [57.161862, 65.497090],
  [57.162072, 65.497670],
  [57.162247, 65.498206],
  [57.162457, 65.498742],
  [57.162655, 65.499365],
  [57.162861, 65.499864],
  [57.163047, 65.500357],
  [57.163210, 65.500872],
  [57.163374, 65.501387],
  [57.163467, 65.501709],
  [57.163292, 65.501902],
  [57.163117, 65.502095],
  [57.162942, 65.502267],
  [57.162709, 65.502503],
  [57.162511, 65.502761],
  [57.162266, 65.503039],
  [57.162033, 65.503318],
  [57.161765, 65.503576],
  [57.161578, 65.503812],
  [57.161287, 65.504069],
  [57.161077, 65.504263],
  [57.160832, 65.504627],
  [57.160564, 65.504863],
  [57.160272, 65.505228],
  [57.160039, 65.505464],
  [57.159748, 65.505829],
  [57.159468, 65.506022],
  [57.159200, 65.506473],
  [57.159025, 65.506816],
  [57.158710, 65.507288],
  [57.158465, 65.507760],
  [57.158115, 65.508211],
  [57.157940, 65.508576],
  [57.157591, 65.509112],
  [57.157346, 65.509648],
  [57.157113, 65.510056],
  [57.156879, 65.510700],
  [57.156681, 65.511193],
  [57.156518, 65.511751],
  [57.156296, 65.512416],
  [57.156075, 65.512867],
  [57.155830, 65.513425],
  [57.155608, 65.513961],
  [57.155387, 65.514455],
  [57.155620, 65.515056],
  [57.155923, 65.515614],
  [57.156296, 65.516107],
  [57.156588, 65.516601],
  [57.156809, 65.517051],
  [57.157159, 65.517523],
  [57.157404, 65.517974],
  [57.157626, 65.518468],
  [57.157929, 65.518918],
  [57.158185, 65.519412],
  [57.158407, 65.519948],
  [57.158701, 65.520549],
  [57.158980, 65.521128],
  [57.159330, 65.521686],
  [57.159657, 65.522287],
  [57.159995, 65.522995],
  [57.160275, 65.522609],
  [57.160519, 65.522244],
  [57.160764, 65.521836],
  [57.160916, 65.521514],
  [57.161149, 65.521128],
  [57.161406, 65.520720],
  [57.161837, 65.520527],
  [57.162315, 65.520334],
  [57.162805, 65.520141],
  [57.163154, 65.519948],
  [57.163422, 65.519787],
  [57.163661, 65.519572],
  [57.163941, 65.519272],
  [57.164198, 65.518907],
  [57.164478, 65.518500],
  [57.164769, 65.518135],
  [57.165084, 65.517727],
  [57.165272, 65.517433],
  [57.165552, 65.517047],
  [57.165879, 65.516639],
  [57.166182, 65.516382],
  [57.166403, 65.516017],
  [57.166660, 65.515609],
  [57.166764, 65.514622],
  [57.166660, 65.514172],
  [57.166403, 65.513442],
  [57.166205, 65.512949],
  [57.166018, 65.512477],
  [57.165832, 65.511854],
  [57.165657, 65.511490],
  [57.165529, 65.510975],
  [57.165366, 65.510524],
  [57.165144, 65.510095],
  [57.164993, 65.509494],
  [57.164853, 65.509172],
  [57.164736, 65.508829],
  [57.164550, 65.508378],
  [57.164445, 65.508035],
  [57.164281, 65.507649],
  [57.164130, 65.507284],
  [57.163967, 65.506876],
  [57.163815, 65.506426],
  [57.163687, 65.505953],
  [57.163570, 65.505524],
  [57.163360, 65.505031],
  [57.163255, 65.504666],
  [57.163081, 65.504258],
  [57.162964, 65.503808],
  [57.162801, 65.503228],
  [57.162521, 65.502456],
  [57.162346, 65.502134],
  [57.162218, 65.501598],
  [57.162078, 65.501276],
  [57.161926, 65.500825],
  [57.161798, 65.500439],
  [57.161658, 65.499924],
  [57.161518, 65.499581],
  [57.161378, 65.499130],
  [57.161262, 65.498722],
  [57.161122, 65.498336],
  [57.161064, 65.498057],
  [57.160912, 65.498207],
  [57.160714, 65.498443],
  [57.160551, 65.498594],
  [57.160399, 65.498787],
  [57.160259, 65.499023],
  [57.160073, 65.499280],
  [57.159921, 65.499430],
  [57.159804, 65.499623],
  [57.159560, 65.499924],
  [57.159338, 65.500096],
  [57.159233, 65.500374],
  [57.159105, 65.500525]
];
        routePoints.forEach((point, i) => {
          const placemark = new window.ymaps.Placemark(point, {
            balloonContent: `Точка ${i + 1}`
          });
          map.geoObjects.add(placemark);
        });

        const line = new window.ymaps.Polyline(routePoints, {}, {
          strokeColor: '#0000FF',
          strokeWidth: 4
        });
        map.geoObjects.add(line);
      });
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Панель оператора
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">Выбор маршрута</Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="route-select-label">Маршрут</InputLabel>
            <Select
              labelId="route-select-label"
              value={selectedRoute}
              label="Маршрут"
              onChange={(e) => setSelectedRoute(e.target.value)}
            >
              <MenuItem value={'Маршрут #1'}>Маршрут #1</MenuItem>
              <MenuItem value={'Маршрут #2'}>Маршрут #2</MenuItem>
              <MenuItem value={'Маршрут #3'}>Маршрут #3</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography>Назначенный дрон: <strong>{assignedDrone}</strong></Typography>
            <Typography>Статус дрона: <strong>{droneStatus}</strong></Typography>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {/* Карта маршрута */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: 400, padding: 2 }}>
              <Typography variant="h6" gutterBottom>Карта маршрута</Typography>
              <Box sx={{ height: '90%' }}>
                <div ref={mapRef} id="yandex-map" style={{ width: '100%', height: '100%' }} />
              </Box>
            </Paper>
          </Grid>

          {/* Телеметрия и управление */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: 400, padding: 2 }}>
              <Typography variant="h6">Телеметрия</Typography>
              <Box sx={{ mt: 2 }}>
                <Typography>Скорость: 0 км/ч</Typography>
                <Typography>Высота: 0 м</Typography>
                <Typography>Координаты: 59.9343° N, 30.3351° E</Typography>
                <Typography>Батарея: 100%</Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Управление полётом</Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }}>
                  Подключиться к БПЛА-3
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Видеопоток */}
          <Grid item xs={12}>
            <Paper sx={{ height: 300, padding: 2 }}>
              <Typography variant="h6">Видеопоток с БПЛА</Typography>
              <Box sx={{ height: '85%', backgroundColor: '#cfd8dc' }}>
                <Typography align="center" sx={{ pt: 10 }}>
                  [Здесь будет отображаться видеопоток]
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
};

export default OperatorPanel;