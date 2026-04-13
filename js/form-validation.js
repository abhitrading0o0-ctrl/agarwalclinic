/**
 * form-validation.js - floating labels, validation, and WhatsApp submit flows
 */

'use strict';

function initFloatingLabels() {
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(field => {
    if (field.tagName !== 'SELECT') field.setAttribute('placeholder', ' ');

    field.addEventListener('focus', () => field.closest('.form-group')?.classList.add('focused'));
    field.addEventListener('blur', () => {
      field.closest('.form-group')?.classList.remove('focused');
      validateField(field, true);
    });

    field.addEventListener('change', () => validateField(field, true));
  });
}

const rules = {
  name: {
    test: value => value.trim().length >= 2,
    msg: 'Please enter your full name (at least 2 characters).'
  },
  phone: {
    test: value => /^[6-9]\d{9}$/.test(value.replace(/\s/g, '')),
    msg: 'Enter a valid 10-digit Indian mobile number.'
  },
  email: {
    test: value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    msg: 'Enter a valid email address.'
  },
  message: {
    test: value => value.trim().length >= 5,
    msg: 'Please describe your concern (at least 5 characters).'
  },
  service: {
    test: value => value !== '',
    msg: 'Please select a treatment or reason.'
  }
};

function validateField(field, showError = true) {
  const name = field.name || field.dataset.validate;
  const rule = rules[name];
  const group = field.closest('.form-group');
  if (!rule || !group) return true;

  const valid = rule.test(field.value);

  if (showError) {
    group.classList.toggle('error', !valid);
    group.classList.toggle('success', valid && field.value.trim() !== '');

    let error = group.querySelector('.field-error');
    if (!error) {
      error = document.createElement('span');
      error.className = 'field-error';
      group.appendChild(error);
    }

    error.textContent = valid ? '' : rule.msg;

    if (!valid) {
      group.classList.add('shake');
      group.addEventListener('animationend', () => group.classList.remove('shake'), { once: true });
    }
  }

  return valid;
}

function validateForm(form) {
  let allValid = true;

  form.querySelectorAll('input[name], textarea[name], select[name]').forEach(field => {
    if (!validateField(field, true)) allValid = false;
  });

  return allValid;
}

function setButtonState(button, loadingText, idleText, isLoading) {
  if (!button) return;

  const btnText = button.querySelector('.btn-text');
  const btnLabel = button.querySelector('.btn-label');
  const spinner = button.querySelector('.spinner');

  button.disabled = isLoading;
  button.style.opacity = isLoading ? '0.88' : '';

  if (btnLabel) btnLabel.textContent = isLoading ? loadingText : idleText;
  else if (btnText) btnText.textContent = isLoading ? loadingText : idleText;
  else button.textContent = isLoading ? loadingText : idleText;

  if (spinner) spinner.style.display = isLoading ? 'block' : 'none';
}

function resetFormFeedback(form) {
  form.querySelectorAll('.form-group').forEach(group => {
    group.classList.remove('error', 'success', 'focused');
    const error = group.querySelector('.field-error');
    if (error) error.textContent = '';
  });
}

function buildAppointmentWhatsAppLink(data) {
  const phone = '919412589572';
  const message = [
    'Appointment Request - Agarwal Dental Clinic',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : '',
    `Date: ${data.date || 'Not selected'}`,
    `Time: ${data.time || 'Not selected'}`,
    data.service ? `Service: ${data.service}` : '',
    data.message ? `Notes: ${data.message}` : '',
    '',
    'Sent via Agarwal Dental Clinic website'
  ].filter(Boolean).join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function buildContactWhatsAppLink(data) {
  const phone = '919412589572';
  const message = [
    'Contact Request - Agarwal Dental Clinic',
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    data.email ? `Email: ${data.email}` : '',
    data.service ? `Treatment Needed: ${data.service}` : '',
    `Message: ${data.message}`,
    '',
    'Sent via Agarwal Dental Clinic website'
  ].filter(Boolean).join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  const submitButton = form.querySelector('#wa-submit-btn');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateForm(this)) {
      const firstError = this.querySelector('.form-group.error input, .form-group.error textarea, .form-group.error select');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError?.focus();
      return;
    }

    setButtonState(submitButton, 'Opening WhatsApp...', 'Book via WhatsApp', true);

    const data = {
      name: this.querySelector('[name="name"]')?.value || '',
      phone: this.querySelector('[name="phone"]')?.value || '',
      email: this.querySelector('[name="email"]')?.value || '',
      service: this.querySelector('[name="service"]')?.value || '',
      date: document.getElementById('selected-date')?.value || '',
      time: document.getElementById('selected-time')?.value || '',
      message: this.querySelector('[name="message"]')?.value || ''
    };

    const popup = window.open('', '_blank');

    setTimeout(() => {
      const whatsappLink = buildAppointmentWhatsAppLink(data);
      if (popup) popup.location = whatsappLink;
      else window.open(whatsappLink, '_blank');
      setButtonState(submitButton, 'Opening WhatsApp...', 'Book via WhatsApp', false);
    }, 350);
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitButton = form.querySelector('#contact-wa-submit');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validateForm(this)) return;

    setButtonState(submitButton, 'Opening WhatsApp...', 'Send on WhatsApp', true);

    const data = {
      name: this.querySelector('[name="name"]')?.value || '',
      phone: this.querySelector('[name="phone"]')?.value || '',
      email: this.querySelector('[name="email"]')?.value || '',
      service: this.querySelector('[name="service"]')?.value || '',
      message: this.querySelector('[name="message"]')?.value || ''
    };

    const popup = window.open('', '_blank');

    setTimeout(() => {
      const whatsappLink = buildContactWhatsAppLink(data);
      if (popup) popup.location = whatsappLink;
      else window.open(whatsappLink, '_blank');
      this.reset();
      resetFormFeedback(this);
      setButtonState(submitButton, 'Opening WhatsApp...', 'Send on WhatsApp', false);
      showToast('WhatsApp is ready with your message. Please tap send.');
    }, 320);
  });
}

function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1d4ed8;
    color: white;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-family: 'Outfit', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    box-shadow: 0 8px 32px rgba(29,78,216,0.35);
    z-index: 9999;
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  }, 40);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 380);
  }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  initFloatingLabels();
  initAppointmentForm();
  initContactForm();
});
