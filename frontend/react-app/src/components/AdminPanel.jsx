import React, { useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Header from './Header.jsx';
import IconButton from '@mui/material/IconButton';
import EditIcon   from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip    from '@mui/material/Tooltip'; 

const initialUsers = [
  { id: 1, username: 'admin', role: 'администратор', createdAt: '2025-06-01', active: true },
  { id: 2, username: 'operator1', role: 'оператор', createdAt: '2025-06-02', active: true },
  { id: 3, username: 'analyst1', role: 'аналитик', createdAt: '2025-06-03', active: false },
];

const roles = ['администратор', 'оператор', 'аналитик'];

export default function AdminPanel() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const handleOpen = (user = null) => {
    setEditUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setEditUser(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить пользователя?')) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase()) &&
    (filterRole ? user.role === filterRole : true)
  );

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      username: Yup.string().required('Обязательное поле'),
      password: Yup.string().min(6, 'Не менее 6 символов'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать'),
      role: Yup.string().required('Выберите роль'),
    }),
    onSubmit: (values) => {
      if (editUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id ? { ...u, username: values.username, role: values.role } : u
          )
        );
      } else {
        const newUser = {
          id: Date.now(),
          username: values.username,
          role: values.role,
          createdAt: new Date().toISOString().split('T')[0],
          active: true,
        };
        setUsers((prev) => [...prev, newUser]);
      }
      handleClose();
    },
  });

const columns = [
  { field: 'username',   headerName: 'Имя пользователя', flex: 1 },
  { field: 'role',       headerName: 'Роль',             flex: 1 },
  { field: 'createdAt',  headerName: 'Дата регистрации', flex: 1 },
  {
    field: 'active',
    headerName: 'Статус',
    flex: 1,
    renderCell: (params) => (params.value ? 'Активен' : 'Заблокирован'),
  },
  {
    field: 'actions',
    headerName: 'Действия',
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <>
        <Tooltip title="Редактировать">
          <IconButton
            size="small"
            aria-label="редактировать"
            onClick={() => handleOpen(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Удалить">
          <IconButton
            size="small"
            color="error"
            aria-label="удалить"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </>
    ),
  },
];

  return (
    <Box sx={{ p: 3 }}>
      <Header/>
      <br></br>
      <Typography variant="h4" gutterBottom>Управление пользователями</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Поиск по имени"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Фильтр по роли</InputLabel>
          <Select
            value={filterRole}
            label="Фильтр по роли"
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => handleOpen()}>Создать</Button>
      </Box>

      <DataGrid
        autoHeight
        rows={filteredUsers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editUser ? 'Редактировать пользователя' : 'Создать пользователя'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              name="username"
              label="Имя пользователя"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              label="Подтверждение пароля"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                name="role"
                value={formik.values.role}
                label="Роль"
                onChange={formik.handleChange}
                error={formik.touched.role && Boolean(formik.errors.role)}
              >
                {roles.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
            <DialogActions>
              <Button onClick={handleClose}>Отмена</Button>
              <Button type="submit" variant="contained">Сохранить</Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
