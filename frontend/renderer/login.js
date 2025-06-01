document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('loginForm');

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Отправляем данные в главный процесс для запроса к серверу
    window.electron.send('login-request', { username, password });

    // Ожидаем ответа от главного процесса
    window.electron.on('login-response', (event, response) => {
      if (response.success) {
        // Сохраняем токен и роль в localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role); // Сохраняем роль в localStorage

        // Перенаправляем на Dashboard
        window.location.href = './dashboard.html';
      } else {
        alert(response.message || 'Неверные данные пользователя');
      }
    });
  });
});
