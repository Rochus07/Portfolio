/* LOADER / PRELOADER ANIMATION */
window.addEventListener('load', () => {
    const percent     = document.getElementById("percent");
    const bgPercent   = document.getElementById("bg-percent");
    const loaderBar   = document.getElementById("loader-bar");
    const loaderStatus = document.getElementById("loader-status");
    const loader      = document.getElementById("loader");

    let count = 0;
    const statuses = [
        "Initializing...",
        "Fetching data...",
        "Digitalizing components...",
        "Finalizing...",
        "System Ready."
    ];

    const updateLoader = () => {
        count += Math.floor(Math.random() * 5) + 2;
        if (count > 100) count = 100;

        percent.innerText   = count;
        bgPercent.innerText = count.toString().padStart(3, '0');
        loaderBar.style.width = `${count}%`;

        // Update status label based on progress
        if      (count < 25)  loaderStatus.innerText = statuses[0];
        else if (count < 50)  loaderStatus.innerText = statuses[1];
        else if (count < 75)  loaderStatus.innerText = statuses[2];
        else if (count < 95)  loaderStatus.innerText = statuses[3];
        else                  loaderStatus.innerText = statuses[4];

        if (count < 100) {
            setTimeout(updateLoader, 50);
        } else {
            // Slide loader away after a short pause
            setTimeout(() => { loader.classList.add("loaded"); }, 600);
        }
    };

    updateLoader();
});


/* TYPING ANIMATION */
const phrases  = ["UI/UX Designer", "Front-end Developer"];
let countPhrase = 0;
let indexChar   = 0;

(function type() {
    if (countPhrase === phrases.length) countPhrase = 0;

    const currentText = phrases[countPhrase];
    const letter      = currentText.slice(0, ++indexChar);

    document.getElementById("typing").textContent = letter;

    if (letter.length === currentText.length) {
        // Finished typing a phrase — move to the next after a pause
        countPhrase++;
        indexChar = 0;
        setTimeout(type, 2500);
    } else {
        setTimeout(type, 120);
    }
}());


/* SCROLL REVEAL */
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));


/* NAVIGATION OVERLAY — Triple Bar Menu */
const toggle      = document.getElementById('menu-toggle');
const overlay     = document.getElementById('nav-overlay');
const overlayClose = document.getElementById('overlay-close');

function openMenu() {
    toggle.classList.add('open');
    overlay.classList.add('open');
}

function closeMenu() {
    toggle.classList.remove('open');
    overlay.classList.remove('open');
}

// Toggle on triple bar click
toggle.addEventListener('click', () => {
    overlay.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on X button click
overlayClose.addEventListener('click', closeMenu);

// Close when any nav link is clicked
overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
});


/* Dark/Light Mode */
const themeBtn = document.getElementById('theme-toggle');
const html     = document.documentElement;

// Apply saved theme on load
if (localStorage.getItem('theme') === 'white') {
    html.classList.add('white-mode');
}

// Toggle on button click
themeBtn.addEventListener('click', () => {
    html.classList.toggle('white-mode');
    const isWhite = html.classList.contains('white-mode');
    localStorage.setItem('theme', isWhite ? 'white' : 'dark');
});


/* EMAILJS — Contact Form */
emailjs.init("ptBvr6OmvD8b-iTUd"); // 🔑 Replace with your EmailJS Public Key

const contactForm  = document.getElementById('contact-form');
const statusMsg    = document.getElementById('status');
const submitBtn    = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 🍯 Honeypot check — bots fill this, humans never see it
    const honeypot = document.getElementById("honeypot");
    if (honeypot && honeypot.value.length > 0) {
        console.log("Spambot detected. Submission blocked.");
        contactForm.reset();
        return;
    }

    // Show loading state
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending...';

    emailjs.sendForm(
        "service_ae9hyra",   // 🔑 Replace with your EmailJS Service ID
        "template_4qnw5os",  // 🔑 Replace with your EmailJS Template ID
        contactForm
    )
    .then(() => {
        statusMsg.textContent = '✅ Message Sent Successfully!';
        statusMsg.classList.remove('hidden', 'text-red-400');
        statusMsg.classList.add('text-accentCyan');
        contactForm.reset();
    })
    .catch((error) => {
        console.error('EmailJS error:', error);
        statusMsg.textContent = '❌ Failed to send. Please try again.';
        statusMsg.classList.remove('hidden', 'text-accentCyan');
        statusMsg.classList.add('text-red-400');
    })
    .finally(() => {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
        // Hide status after 5 seconds
        setTimeout(() => statusMsg.classList.add('hidden'), 5000);
    });
});