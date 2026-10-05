const message = document.getElementById('message');

// Créer un utilisateur
document.getElementById('create-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const body = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  const response = await fetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();

  if (response.ok) {
    window.location.reload();
  } else {
    message.textContent = data.message;
  }
});

// Modifier un utilisateur
document.querySelectorAll('.btn-update').forEach((button) => {
  button.addEventListener('click', async () => {
    const row = button.closest('tr');
    const passwordInput = row.querySelector('.f-password');

    const body = { username: row.querySelector('.f-username').value };
    if (passwordInput.value) {
      body.password = passwordInput.value;
    }

    const response = await fetch(`/users/${encodeURIComponent(row.dataset.email)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (response.ok) {
      passwordInput.value = '';
      message.textContent = 'Utilisateur modifié avec succès';
    } else {
      message.textContent = data.message;
    }
  });
});

// Supprimer un utilisateur
document.querySelectorAll('.btn-delete').forEach((button) => {
  button.addEventListener('click', async () => {
    if (!confirm('Supprimer cet utilisateur ?')) return;

    const row = button.closest('tr');
    const response = await fetch(`/users/${encodeURIComponent(row.dataset.email)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      window.location.reload();
    } else {
      const data = await response.json();
      message.textContent = data.message;
    }
  });
});