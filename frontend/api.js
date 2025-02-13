// api.js

import axios from "axios";

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // базовый URL для всех запросов
  timeout: 5000, // таймаут запроса
});

export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    console.error('Ошибка запроса на сервер:', error);
    throw new Error('Ошибка при соединении с сервером');
  }
};


