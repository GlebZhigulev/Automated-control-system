const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Базовый URL сервера
  timeout: 5000,
});

export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data;
  } catch (error) {
    console.error('Ошибка запроса на сервер:', error);
    throw new Error('Ошибка при соединении с сервером');
  }
};


// Получение списка операторов
export const fetchOperators = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении списка операторов:', error);
    throw error;
  }
};

// Добавление нового оператора
export const addOperator = async (username, password) => {
  try {
    await apiClient.post('/auth/register', {
      username,
      password,
      role: 'operator',
    });
  } catch (error) {
    console.error('Ошибка при добавлении оператора:', error);
    throw error;
  }
};

// Удаление оператора
export const deleteOperator = async (id) => {
  try {
    await apiClient.delete(`/users/${id}`);
  } catch (error) {
    console.error('Ошибка при удалении оператора:', error);
    throw error;
  }
};



