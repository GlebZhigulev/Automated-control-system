import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import isDev from 'electron-is-dev';
import { login } from './api.js';
import Store from 'electron-store';

// Определяем __dirname для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let userRole = null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3001/');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'react-app/build/index.html'));
  }
});

ipcMain.on('login-request', async (event, data) => {
  try {
    const response = await login(data.username, data.password);

    if (response.token) {
      userRole = response.role;

      event.reply('login-response', {
        success: true,
        role: response.role,
        token: response.token,
      });
    } else {
      event.reply('login-response', {
        success: false,
        message: 'Ошибка входа',
      });
    }
  } catch (err) {
    console.error('Ошибка при запросе:', err);
    event.reply('login-response', {
      success: false,
      message: err.message || 'Ошибка при соединении',
    });
  }
});

ipcMain.handle('check-auth', () => {
  if (userRole) {
    return { isAuthenticated: true, role: userRole };  // Возвращаем информацию о текущем пользователе
  }
  return { isAuthenticated: false };  // Если роль не задана, значит пользователь не авторизован
});

ipcMain.handle('login', async (event, data) => {
  try {
    const response = await login(data.username, data.password);
    if (response.token) {
      return { success: true, role: response.role, token: response.token };
    } else {
      return { success: false, message: 'Ошибка входа' };
    }
  } catch (err) {
    console.error('Ошибка при запросе:', err);
    return { success: false, message: err.message || 'Ошибка при соединении' };
  }
});

