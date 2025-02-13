const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// POST /api/auth/login - Авторизация
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Неверный пароль" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token,  role: user.role});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка на сервере" });
  }
});

// POST /api/auth/register - Регистрация (для добавления новых пользователей)
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create(username, hashedPassword, role);

    res.status(201).json({ id: userId, username, role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка на сервере" });
  }
});

module.exports = router;
