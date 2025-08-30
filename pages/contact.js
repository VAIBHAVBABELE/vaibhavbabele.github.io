const name = document.getElementById('name');
const email = document.getElementById('email');
const message = document.getElementById('message');
const phone = document.getElementById('phone');
const subject = document.getElementById('subject');
const submit = document.getElementById('submit');

submit.addEventListener('click', (e) => {
    e.preventDefault();
    if (name.value === '' || email.value === '' || message.value === '' || phone.value === '' || subject.value === '') {
        alert('Please fill all the fields');
        return;
    }
    if (!validateEmail(email) || !validatePhone(phone)) {
        return;
    }
    alert('Form submitted successfully');
    name.value = '';
    email.value = '';
    message.value = '';
    phone.value = '';
    subject.value = '';
});

const validateEmail = (email) => {
    if (email.value === '') {
        alert('Please enter your email');
        return false;
    }
    if (!email.value.includes('@') || !email.value.includes('.')) {
        alert('Please enter a valid email');
        return false;
    }
    return true;
}

const validatePhone = (phone) => {
    if (phone.value === '') {
        alert('Please enter your phone number');
        return false;
    }
    if (phone.value.length !== 10 || isNaN(phone.value)) {
        alert('Please enter a valid phone number');
        return false;
    }
    return true;
}