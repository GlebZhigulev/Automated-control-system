// src/components/FlightPlans.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { YMaps, Map, Placemark, Polyline } from 'react-yandex-maps';
import Header from './Header.jsx';

const mockFlights = [
  {
    id: 1,
    route: 'Маршрут A',
    date: '2025-06-10',
    drone: 'Drone-Alpha',
    status: 'запланирован',
    points: [
      [57.161862, 65.49709],
      [57.162072, 65.49767],
      [57.162247, 65.498206],
    ],
  },
  {
    id: 2,
    route: 'Маршрут B',
    date: '2025-06-12',
    drone: 'Drone-Beta',
    status: 'выполнен',
    points: [
      [57.162457, 65.498742],
      [57.162655, 65.499365],
      [57.162861, 65.499864],
    ],
  },
];

const FlightPlans = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const filteredFlights = statusFilter
    ? mockFlights.filter(flight => flight.status === statusFilter)
    : mockFlights;

  return (
    <Box p={3}>
        <Header/>
        <br />
      <Typography variant="h4" gutterBottom>Планы полётов</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Статус</InputLabel>
              <Select
                value={statusFilter}
                label="Статус"
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="запланирован">Запланирован</MenuItem>
                <MenuItem value="выполняется">Выполняется</MenuItem>
                <MenuItem value="выполнен">Выполнен</MenuItem>
              </Select>
            </FormControl>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Маршрут</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Дрон</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFlights.map(flight => (
                  <TableRow key={flight.id}>
                    <TableCell>{flight.route}</TableCell>
                    <TableCell>{flight.date}</TableCell>
                    <TableCell>{flight.drone}</TableCell>
                    <TableCell>{flight.status}</TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => setSelectedFlight(flight)}>
                        Просмотр
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: 500 }}>
            {selectedFlight ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Маршрут: {selectedFlight.route}
                </Typography>
                <YMaps>
                  <Map
                    defaultState={{
                      center: selectedFlight.points[0],
                      zoom: 16,
                    }}
                    width="100%"
                    height="400px"
                  >
                    {selectedFlight.points.map((point, index) => (
                      <Placemark
                        key={index}
                        geometry={point}
                        properties={{ hintContent: `Точка ${index + 1}` }}
                      />
                    ))}
                    <Polyline
                      geometry={selectedFlight.points}
                      options={{ strokeColor: '#ff0000', strokeWidth: 3 }}
                    />
                  </Map>
                </YMaps>
              </>
            ) : (
              <Typography color="textSecondary">Выберите полёт для отображения маршрута</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FlightPlans;
