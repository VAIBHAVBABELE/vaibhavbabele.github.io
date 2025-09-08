const name = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');
const phone = document.getElementById('phone');
const subject = document.getElementById('subject');
const form = document.getElementById('contactForm'); // sahi ID

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    alert('Form submitted successfully!');
    form.reset(); // form ke sab fields reset karega
});

function validateForm() {
    if (name.value.trim() === '') {
        alert('Please enter your name');
        return false;
    }
    if (email.value.trim() === '') {
        alert('Please enter your email');
        return false;
    }
    if (!validateEmail(email.value.trim())) {
        alert('Please enter a valid email');
        return false;
    }
    if (phone.value.trim() !== '' && !validatePhone(phone.value.trim())) {
        alert('Please enter a valid 10-digit phone number');
        return false;
    }
    if (subject.value.trim() === '') {
        alert('Please select a subject');
        return false;
    }
    if (message.value.trim() === '') {
        alert('Please enter your message');
        return false;
    }
    return true;
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validatePhone(phone) {
    const phonePattern = /^[0-9]{10}$/;
    return phonePattern.test(phone);
}
