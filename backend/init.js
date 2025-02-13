const bcrypt = require('bcryptjs');
const User = require('./models/user');

const initializeDatabase = async () => {
  try {
    // Хэшируем пароли
    const adminPassword = await bcrypt.hash('admin123', 10);
    const operatorPassword = await bcrypt.hash('operator123', 10);

    // Начальные пользователи
    const users = [
      { username: 'admin', password: adminPassword, role: 'admin' },
      { username: 'operator', password: operatorPassword, role: 'operator' },
    ];

    for (const user of users) {
      // Проверяем, существует ли пользователь
      const existingUser = await User.findByUsername(user.username);
      if (!existingUser) {
        // Создаем нового пользователя
        await User.create(user.username, user.password, user.role);
        console.log(`User "${user.username}" created.`);
      } else {
        console.log(`User "${user.username}" already exists.`);
      }
    }

    console.log('Database initialized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();
