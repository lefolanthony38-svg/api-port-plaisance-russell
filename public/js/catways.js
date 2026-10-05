const message = document.getElementById('message');

// Créer un catway
document.getElementById('create-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const body = {
    catwayNumber: Number(document.getElementById('catwayNumber').value),
    catwayType: document.getElementById('catwayType').value,
    catwayState: document.getElementById('catwayState').value,
  };

  const response = await fetch('/catways', {
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

// Modifier l'état d'un catway
document.querySelectorAll('.btn-update').forEach((button) => {
  button.addEventListener('click', async () => {
    const number = button.dataset.number;
    const input = document.querySelector(`[data-state-for="${number}"]`);

    const response = await fetch(`/catways/${number}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ catwayState: input.value }),
    });
    const data = await response.json();

    message.textContent = response.ok ? 'État modifié avec succès' : data.message;
  });
});

// Supprimer un catway
document.querySelectorAll('.btn-delete').forEach((button) => {
  button.addEventListener('click', async () => {
    if (!confirm('Supprimer ce catway ?')) return;

    const response = await fetch(`/catways/${button.dataset.number}`, {
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