import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Grid } from '@mui/material';
import ReactPlayer from 'react-player';
import { YMaps, Map, Polyline } from 'react-yandex-maps';
import Header from './Header.jsx';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import mask1 from '../assets/mask1.png';
import mask2 from '../assets/mask2.png';
import videoFile from '../assets/video.mp4';

const flightsWithAnalysis = [
  {
    id: 1,
    route: 'Маршрут А',
    operator: 'operator1',
    date: '2025-06-05',
    duration: '15 мин',
    coords: [[57.1618, 65.4970], [57.1628, 65.4998], [57.1634, 65.5017]],
    video: videoFile,
    defects: [
      {
        id: 1,
        location: '57.1620, 65.4982',
        image: image1,
        mask: mask1
      },
      {
        id: 2,
        location: '57.1629, 65.4998',
        image: image2,
        mask: mask2
      }
    ]
  }
];

const AnalystPanel = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [search, setSearch] = useState('');

  const filteredFlights = flightsWithAnalysis.filter(flight =>
    flight.route.toLowerCase().includes(search.toLowerCase())
  );

return (
  <Box p={3}>
    <Header />
    <br />
    <Typography variant="h4" gutterBottom>Анализ дефектов</Typography>

    {/* ────────────────────────────────────────────────────────────
        ЕСЛИ РЕЙС НЕ ВЫБРАН: СПИСОК МАРШРУТОВ
    ──────────────────────────────────────────────────────────── */}
    {!selectedFlight ? (
      <>
        <TextField
          label="Поиск по маршруту"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Маршрут</TableCell>
                <TableCell>Оператор</TableCell>
                <TableCell>Дата</TableCell>
                <TableCell>Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFlights.map((flight) => (
                <TableRow key={flight.id}>
                  <TableCell>{flight.route}</TableCell>
                  <TableCell>{flight.operator}</TableCell>
                  <TableCell>{flight.date}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => setSelectedFlight(flight)}>
                      Просмотреть
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </>
    ) : (
      <>
        {/* ────────────────────────────────────────────────────────
            ИНФОРМАЦИЯ О ВЫБРАННОМ ПОЛЁТЕ
        ──────────────────────────────────────────────────────── */}
        <Button onClick={() => setSelectedFlight(null)} sx={{ mb: 2 }}>
          ← Назад
        </Button>

        <Typography variant="h6">Информация о полёте</Typography>
        <Typography>Маршрут: {selectedFlight.route}</Typography>
        <Typography>Оператор: {selectedFlight.operator}</Typography>
        <Typography>Дата выполнения: {selectedFlight.date}</Typography>
        <Typography>Длительность: {selectedFlight.duration}</Typography>

        {/* ────────────────────────────────────────────────────────
            КАРТА + ВИДЕО В ОДНОЙ СТРОКЕ
        ──────────────────────────────────────────────────────── */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* левая колонка — карта */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Карта маршрута
            </Typography>
            <Paper sx={{ height: 300 }}>
              <YMaps>
                <Map
                  defaultState={{ center: selectedFlight.coords[0], zoom: 15 }}
                  width="100%"
                  height="100%"
                >
                  <Polyline
                    geometry={selectedFlight.coords}
                    options={{ strokeColor: '#0000FF', strokeWidth: 4 }}
                  />
                </Map>
              </YMaps>
            </Paper>
          </Grid>

          {/* правая колонка — видео */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Видеозапись полёта
            </Typography>
            <Paper sx={{ height: 300 }}>
              <ReactPlayer
                url={selectedFlight.video}
                controls
                width="100%"
                height="100%"
              />
            </Paper>
          </Grid>
        </Grid>

        {/* ────────────────────────────────────────────────────────
            ТАБЛИЦА ДЕФЕКТОВ
        ──────────────────────────────────────────────────────── */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Найденные дефекты
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Кадр</TableCell>
              <TableCell>Маска</TableCell>
              <TableCell>Координаты</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedFlight.defects.map((defect) => (
              <TableRow key={defect.id}>
                <TableCell>
                  <img src={defect.image} alt="Кадр" width={150} />
                </TableCell>
                <TableCell>
                  <img src={defect.mask} alt="Маска" width={150} />
                </TableCell>
                <TableCell>{defect.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button variant="contained" color="primary" sx={{ mt: 3 }}>
          Сгенерировать отчёт
        </Button>
      </>
    )}
  </Box>
);

};

export default AnalystPanel;
