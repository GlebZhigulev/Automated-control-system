import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Grid, Alert, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { YMaps, Map, Polyline, Placemark } from 'react-yandex-maps';
import Header from './Header.jsx';

const mockFlights = [
  {
    id: 1,
    name: 'Маршрут Восток',
    date: '2025-06-12',
    drone: 'Drone-01',
    status: 'запланирован',
    route: [
      [57.161862, 65.497090],
      [57.162861, 65.499864],
      [57.163467, 65.501709],
    ],
  },
  {
    id: 2,
    name: 'Маршрут Север',
    date: '2025-06-15',
    drone: 'Drone-02',
    status: 'запланирован',
    route: [
      [57.170000, 65.500000],
      [57.171000, 65.502000],
      [57.172000, 65.504000],
    ],
  },
];

const OperatorPanel = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [status, setStatus] = useState('ожидание подключения');
  const [position, setPosition] = useState([]);
  const [battery, setBattery] = useState(100);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [error, setError] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!connected || !selectedFlight) return;

    timerRef.current = setInterval(() => {
      const route = selectedFlight.route;
      const index = route.findIndex(([lat, lon]) => lat === position[0] && lon === position[1]);
      const next = route[index + 1];
      if (next) {
        setPosition(next);
        setBattery(prev => Math.max(prev - 10, 0));
        setLastUpdate(Date.now());
      } else {
        setStatus('завершено');
        clearInterval(timerRef.current);
      }
    }, 3000);

    return () => clearInterval(timerRef.current);
  }, [connected, position, selectedFlight]);

  useEffect(() => {
    const lossTimer = setInterval(() => {
      if (connected && Date.now() - lastUpdate > 5000) {
        setError(true);
        setStatus('ошибка связи');
      }
    }, 1000);
    return () => clearInterval(lossTimer);
  }, [connected, lastUpdate]);

  const handleSelectFlight = (id) => {
    const flight = mockFlights.find(f => f.id === id);
    setSelectedFlight(flight);
    setPosition(flight.route[0]);
    setStatus('ожидание подключения');
    setBattery(100);
    setConnected(false);
    setError(false);
  };

  const connect = () => {
    setConnected(true);
    setStatus('готовность');
  };

  const startMission = () => {
    setStatus('выполнение');
    setLastUpdate(Date.now());
  };

  const emergencyLanding = () => {
    setStatus('аварийная посадка');
    clearInterval(timerRef.current);
  };

  return (
    <Box p={3}>
      <Header />
      <br />
      <Typography variant="h4" gutterBottom>Выполнение полёта</Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Выберите полёт</InputLabel>
        <Select
          value={selectedFlight?.id || ''}
          label="Выберите полёт"
          onChange={(e) => handleSelectFlight(e.target.value)}
        >
          {mockFlights.map(flight => (
            <MenuItem key={flight.id} value={flight.id}>
              {`${flight.name} — ${flight.date}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedFlight && (
        <>
          <Typography>Маршрут: {selectedFlight.name}</Typography>
          <Typography>Дата: {selectedFlight.date}</Typography>
          <Typography>Дрон: {selectedFlight.drone}</Typography>
          <Typography>Статус: {selectedFlight.status}</Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3}>
                <YMaps>
                  <Map defaultState={{ center: position, zoom: 15 }} width="100%" height="400px">
                    <Polyline geometry={selectedFlight.route} options={{ strokeColor: '#0000FF', strokeWidth: 4 }} />
                    <Placemark geometry={position} options={{ preset: 'islands#redDotIcon' }} />
                  </Map>
                </YMaps>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">Управление</Typography>
                <Button onClick={connect} variant="contained" fullWidth sx={{ mt: 1 }}>Подключиться к БПЛА</Button>
                <Button onClick={startMission} variant="contained" fullWidth sx={{ mt: 1 }} disabled={!connected}>Аварийная посадка</Button>
                <Button onClick={emergencyLanding} variant="outlined" fullWidth sx={{ mt: 1 }} disabled={true} color="error">Завершить полет</Button>

                <Typography variant="h6" sx={{ mt: 2 }}>Телеметрия</Typography>
                <Typography>Координаты: {position?.join(', ')}</Typography>
                <Typography>Скорость: Н/a</Typography>
                <Typography>Высота: Н/a</Typography>
                <Typography>Заряд: Н/a</Typography>
                <Typography>Статус: {status}</Typography>
              </Paper>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Связь с дроном потеряна!
                </Alert>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default OperatorPanel;
