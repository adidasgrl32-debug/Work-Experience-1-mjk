const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const formLoadTime = Date.now();

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const honeypot = document.getElementById('company').value;
  const timeElapsed = Date.now() - formLoadTime;

  if (honeypot.trim() !== '' || timeElapsed < 3000) {
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.className = 'form-status form-status--success';
    return;
  }

  const timeInput = document.createElement('input');
  timeInput.type = 'hidden';
  timeInput.name = 'form_loaded_at';
  timeInput.value = formLoadTime;
  form.appendChild(timeInput);

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  const data = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error || 'Something went wrong.');
    }

    form.reset();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
  } catch (error) {
    statusEl.textContent = error.message || 'Something went wrong. Please email hello@calicomedia.co instead.';
    statusEl.classList.add('form-status--error');
  } finally {
    button.disabled = false;
  }
});

