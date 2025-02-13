document.addEventListener("DOMContentLoaded", () => {
    const roleElement = document.getElementById('role');
    const logoutButton = document.getElementById('logoutButton');
  
    // Получаем роль пользователя (можно запросить её по необходимости)
    const userRole = localStorage.getItem('role') || 'Гость'; // Или запросите через IPC, если нужно
  
    // Отображаем роль на странице
    roleElement.textContent = `Роль: ${userRole}`;
  
    // Логика выхода
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login.html';
    });
  });
  