
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const phoneField = document.getElementById('phone');
const subjectField = document.getElementById('subject');
const otherSubjectGroup = document.getElementById('otherSubjectGroup');
const otherSubjectField = document.getElementById('otherSubject');
const messageField = document.getElementById('message');
const form = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Debounce helper
function debounce(fn, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Show/Hide Other subject field
subjectField.addEventListener('change', () => {
  if (subjectField.value === 'other') {
    otherSubjectGroup.style.display = 'block';
  } else {
    otherSubjectGroup.style.display = 'none';
    otherSubjectField.value = '';
  }
});

const toggleBtn = document.getElementById('darkModeToggle');

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
      toggleBtn.textContent = "☀️ Light Mode";
    } else {
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  });

// Inline error display
function showError(input, message) {
  const errorElement = input.parentElement.querySelector('.form-validation');
  errorElement.textContent = message;
  errorElement.style.color = "red";
}

function clearError(input) {
  const errorElement = input.parentElement.querySelector('.form-validation');
  errorElement.textContent = '';
}

// Email validation regex
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Phone validation regex
function validatePhone(phone) {
  const phonePattern = /^[0-9]{10}$/;
  return phonePattern.test(phone);
}

// Main validation
function validateForm() {
  let isValid = true;

  // Name
  if (nameField.value.trim() === '') {
    showError(nameField, 'Please enter your full name');
    isValid = false;
  } else {
    clearError(nameField);
  }

  // Email
  let emailValue = emailField.value.trim();
  if (emailValue === '') {
    showError(emailField, 'Please enter your email address');
    isValid = false;
  } else if (!validateEmail(emailValue)) {
    showError(emailField, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError(emailField);
  }

  // Phone
  let phoneValue = phoneField.value.trim().replace(/\s+/g, ''); // remove spaces
  if (phoneValue !== '' && !validatePhone(phoneValue)) {
    showError(phoneField, 'Phone must be 10 digits only');
    isValid = false;
  } else {
    clearError(phoneField);
  }

  // Subject
  if (subjectField.value.trim() === '') {
    showError(subjectField, 'Please select a subject');
    isValid = false;
  } else {
    clearError(subjectField);
  }

  // Other subject (if selected)
  if (subjectField.value === 'other' && otherSubjectField.value.trim() === '') {
    showError(otherSubjectField, 'Please enter a custom subject');
    isValid = false;
  } else {
    clearError(otherSubjectField);
  }

  // Message
  if (messageField.value.trim() === '') {
    showError(messageField, 'Please enter your message');
    isValid = false;
  } else {
    clearError(messageField);
  }

  return isValid;
}

// Live validation with debounce
[nameField, emailField, phoneField, subjectField, otherSubjectField, messageField].forEach(field => {
  field.addEventListener('input', debounce(() => validateForm(), 500));
});

// Form submit
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Show success message
  successMessage.style.display = 'block';

  // Reset form after success
  form.reset();
  otherSubjectGroup.style.display = 'none';

  // Hide success message after 5 seconds
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
});
