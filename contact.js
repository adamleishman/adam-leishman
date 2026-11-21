document.querySelectorAll('[data-contact-form]').forEach(form => {
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector('.form-status');
  const error = form.querySelector('.form-error');
  const endpoint = form.dataset.endpoint;
  button.disabled = !endpoint;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!endpoint || button.disabled || !form.reportValidity()) return;
    button.disabled = true;
    button.textContent = 'Sending…';
    error.hidden = true;
    status.hidden = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {method: 'POST', body: new FormData(form), headers: {Accept: 'application/json'}, signal: controller.signal});
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      status.textContent = 'Thanks for getting in touch. Your message has been sent.';
      status.hidden = false;
    } catch (_) {
      error.textContent = 'Your message could not be sent. Please try again, or connect with Adam on LinkedIn.';
      error.hidden = false;
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = 'Send message';
    }
  });
});
