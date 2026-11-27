const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

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

const formLoadTime = Date.now();

document.addEventListener('DOMContentLoaded', () => {
  const timeInput = document.createElement('input');
  timeInput.type = 'hidden';
  timeInput.name = 'form_loaded_at';
  timeInput.value = formLoadTime;
  form.appendChild(timeInput);

  form.addEventListener('submit', (event) => {
    const honeypot = document.getElementById('company').value;
    const timeElapsed = Date.now() - formLoadTime;

    if (honeypot.trim() !== '' || timeElapsed < 3000) {
      event.preventDefault();
      form.innerHTML = '<p>Thank you! Your message has been sent.</p>';
      e.target.reset();
      return;
    }
  });
});

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/submit-form', (req, res) => {
  const { name, email, message, loadTime } = req.body;
  const submissionTime = Date.now();
  const minTimeMs = 3000; 

  const parsedLoadTime = Number(loadTime);
  if (!parsedLoadTime || isNaN(parsedLoadTime)) {
    return res.status(400).json({ message: 'Invalid request.' });
  }

  const elapsedTime = submissionTime - parsedLoadTime;

  if (elapsedTime < minTimeMs) {
    console.log(`Bot detected! Form submitted in ${elapsedTime}ms. Dropping.`);
    
    return res.status(200).json({ message: 'Thank you for your message!' });
  }

  console.log(`Legitimate submission received in ${(elapsedTime / 1000).toFixed(2)}s:`, {
    name,
    email,
    message
  });

  res.status(200).json({ message: 'Form submitted successfully!' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
