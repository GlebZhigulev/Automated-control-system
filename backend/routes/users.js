const express = require('express');
const db = require('../db');

const router = express.Router();

// Получение всех пользователей
router.get('/', (req, res) => {
  db.all('SELECT id, username, role FROM users', [], (err, rows) => {
    if (err) {
      console.error('Ошибка при получении пользователей:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json(rows);
    }
  });
});

// Удаление пользователя
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Ошибка при удалении пользователя:', err);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      res.json({ message: 'Пользователь удалён' });
    }
  });
});

module.exports = router;
