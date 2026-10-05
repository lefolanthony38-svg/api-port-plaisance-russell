const message = document.getElementById('message');

// Créer une réservation
document.getElementById('create-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const catwayNumber = document.getElementById('catwayNumber').value;
  const body = {
    clientName: document.getElementById('clientName').value,
    boatName: document.getElementById('boatName').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
  };

  const response = await fetch(`/catways/${catwayNumber}/reservations`, {
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

// Modifier une réservation
document.querySelectorAll('.btn-update').forEach((button) => {
  button.addEventListener('click', async () => {
    const row = button.closest('tr');
    const body = {
      clientName: row.querySelector('.f-client').value,
      boatName: row.querySelector('.f-boat').value,
      startDate: row.querySelector('.f-start').value,
      endDate: row.querySelector('.f-end').value,
    };

    const response = await fetch(
      `/catways/${row.dataset.catway}/reservations/${row.dataset.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();

    message.textContent = response.ok ? 'Réservation modifiée avec succès' : data.message;
  });
});

// Supprimer une réservation
document.querySelectorAll('.btn-delete').forEach((button) => {
  button.addEventListener('click', async () => {
    if (!confirm('Supprimer cette réservation ?')) return;

    const row = button.closest('tr');
    const response = await fetch(
      `/catways/${row.dataset.catway}/reservations/${row.dataset.id}`,
      { method: 'DELETE' }
    );

    if (response.ok) {
      window.location.reload();
    } else {
      const data = await response.json();
      message.textContent = data.message;
    }
  });
});