import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent,
  Grid, IconButton
} from '@mui/material';
import { YMaps, Map, Polyline, Placemark } from 'react-yandex-maps';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Header from './Header.jsx';

const RouteManager = () => {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [tempPoints, setTempPoints] = useState([]);

  const handleMapClick = (e) => {
    const coords = e.get('coords');
    setTempPoints(prev => [...prev, { lat: coords[0], lon: coords[1], alt: 100, wait: 0 }]);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Введите название маршрута'),
    points: Yup.array().of(
      Yup.object({
        lat: Yup.number().required(),
        lon: Yup.number().required(),
        alt: Yup.number().required(),
        wait: Yup.number().required()
      })
    ).min(1, 'Добавьте хотя бы одну точку')
  });

  const filteredRoutes = [...routes]
    .filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'points') return b.points.length - a.points.length;
      return 0;
    });

  const handleSubmit = (values) => {
    const routeData = {
      id: editingRoute ? editingRoute.id : Date.now(),
      name: values.name,
      createdAt: editingRoute ? editingRoute.createdAt : new Date().toISOString().split('T')[0],
      author: 'analyst1',
      points: values.points,
      status: 'активен',
      drone: '',
      description: ''
    };

    setRoutes(prev => editingRoute
      ? prev.map(r => r.id === editingRoute.id ? routeData : r)
      : [...prev, routeData]);

    setModalOpen(false);
    setEditingRoute(null);
    setTempPoints([]);
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить маршрут?')) {
      setRoutes(prev => prev.filter(r => r.id !== id));
      setSelectedRoute(null);
    }
  };

  return (
    <Box p={3}>
      <Header />
      <br />
      <Typography variant="h4" gutterBottom>Маршруты</Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Поиск по маршруту"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <TextField
          select
          label="Сортировать по"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value="date">Дате</option>
          <option value="points">Кол-ву точек</option>
        </TextField>
        <Button variant="contained" onClick={() => {
          setModalOpen(true);
          setTempPoints([]);
          setEditingRoute(null);
        }}>Создать маршрут</Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Автор</TableCell>
              <TableCell>Точек</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoutes.map(route => (
              <TableRow key={route.id} hover>
                <TableCell>{route.name}</TableCell>
                <TableCell>{route.createdAt}</TableCell>
                <TableCell>{route.author}</TableCell>
                <TableCell>{route.points.length}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setSelectedRoute(route)}><AddIcon /></IconButton>
                  <IconButton onClick={() => {
                    setEditingRoute(route);
                    setTempPoints(route.points);
                    setModalOpen(true);
                  }}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(route.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {selectedRoute && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>Просмотр маршрута: {selectedRoute.name}</Typography>
          <Typography>Автор: {selectedRoute.author}</Typography>
          <Typography>Статус: {selectedRoute.status}</Typography>
          <Typography>Описание: {selectedRoute.description || '—'}</Typography>
          <Typography>Связанный дрон: {selectedRoute.drone || 'не назначен'}</Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={6}>
              <YMaps>
                <Map defaultState={{ center: [selectedRoute.points[0].lat, selectedRoute.points[0].lon], zoom: 15 }} width="100%" height="300px">
                  <Polyline geometry={selectedRoute.points.map(p => [p.lat, p.lon])} options={{ strokeColor: '#0000FF', strokeWidth: 4 }} />
                  {selectedRoute.points.map((p, i) => (
                    <Placemark key={i} geometry={[p.lat, p.lon]} />
                  ))}
                </Map>
              </YMaps>
            </Grid>
            <Grid item xs={12} md={6}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Широта</TableCell>
                    <TableCell>Долгота</TableCell>
                    <TableCell>Высота</TableCell>
                    <TableCell>Ожидание</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRoute.points.map((point, i) => (
                    <TableRow key={i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{point.lat}</TableCell>
                      <TableCell>{point.lon}</TableCell>
                      <TableCell>{point.alt}</TableCell>
                      <TableCell>{point.wait}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </Box>
      )}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingRoute ? 'Редактировать маршрут' : 'Создать маршрут'}</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: editingRoute?.name || '',
              points: tempPoints
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form>
                <TextField
                  label="Название маршрута"
                  name="name"
                  fullWidth
                  margin="normal"
                  value={values.name}
                  onChange={handleChange}
                />
                <Box mb={2}>
                  <Typography variant="subtitle1">Карта — кликните для добавления точки</Typography>
                  <YMaps>
                    <Map
                      defaultState={{ center: [57.1620, 65.4982], zoom: 14 }}
                      width="100%"
                      height="300px"
                      onClick={(e) => {
                        const coords = e.get('coords');
                        const newPoint = { lat: coords[0], lon: coords[1], alt: 100, wait: 0 };
                        const newPoints = [...values.points, newPoint];
                        setFieldValue('points', newPoints);
                      }}
                    >
                      <Polyline geometry={values.points.map(p => [p.lat, p.lon])} options={{ strokeColor: '#FF0000', strokeWidth: 3 }} />
                      {values.points.map((p, i) => (
                        <Placemark key={i} geometry={[p.lat, p.lon]} />
                      ))}
                    </Map>
                  </YMaps>
                </Box>

                <FieldArray name="points">
                  {({ remove }) => (
                    <>
                      {values.points.map((point, index) => (
                        <Grid container spacing={1} key={index} sx={{ mt: 2 }}>
                          <Grid item xs={3}><TextField fullWidth label="Широта" name={`points[${index}].lat`} value={point.lat} onChange={handleChange} /></Grid>
                          <Grid item xs={3}><TextField fullWidth label="Долгота" name={`points[${index}].lon`} value={point.lon} onChange={handleChange} /></Grid>
                          <Grid item xs={2}><TextField fullWidth label="Высота" name={`points[${index}].alt`} value={point.alt} onChange={handleChange} /></Grid>
                          <Grid item xs={2}><TextField fullWidth label="Ожидание" name={`points[${index}].wait`} value={point.wait} onChange={handleChange} /></Grid>
                          <Grid item xs={2}><IconButton onClick={() => remove(index)}><DeleteIcon /></IconButton></Grid>
                        </Grid>
                      ))}
                    </>
                  )}
                </FieldArray>

                <Box mt={2}>
                  <Button type="submit" variant="contained">Сохранить</Button>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RouteManager;
