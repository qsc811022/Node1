document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const loginInfo = document.getElementById('login-info');

  if (loginInfo) {
    if (token) {
      loginInfo.innerHTML = '<button id="logout">Logout</button>';
      document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        location.reload();
      });
      loadMenus();
    } else {
      loginInfo.innerHTML = '<a href="login.html">Login</a> | <a href="register.html">Register</a>';
    }
  }

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        location.href = 'index.html';
      } else {
        alert('Login failed');
      }
    });
  }

  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        username: document.getElementById('r-username').value,
        password: document.getElementById('r-password').value,
        fullName: document.getElementById('r-fullname').value,
        department: document.getElementById('r-department').value,
        extension: document.getElementById('r-extension').value,
      };
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.message === 'Registered') {
        alert('Registered, please login');
        location.href = 'login.html';
      } else {
        alert('Register failed');
      }
    });
  }
});

function loadMenus() {
  const token = localStorage.getItem('token');
  fetch('/api/menus/today', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
    const ul = document.getElementById('menus');
    ul.innerHTML = '';
    data.forEach(menu => {
      const li = document.createElement('li');
      li.textContent = menu.Name + ' - $' + menu.Price;
      ul.appendChild(li);
    });
  });
}
