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

/* RATE LIMITING — max 3 submissions per 10 minutes */
const RATE_LIMIT    = 3;
const RATE_WINDOW   = 10 * 60 * 1000; // 10 minutes in ms
const STORAGE_KEY   = 'contact_submissions';

function getRateData() {
    try {
        return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || { count: 0, windowStart: Date.now() };
    } catch { return { count: 0, windowStart: Date.now() }; }
}

function isRateLimited() {
    const data = getRateData();
    const now  = Date.now();
    // Reset window if expired
    if (now - data.windowStart > RATE_WINDOW) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ count: 0, windowStart: now }));
        return false;
    }
    return data.count >= RATE_LIMIT;
}

function incrementRate() {
    const data = getRateData();
    data.count++;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* INPUT SANITIZER — strips HTML tags to prevent XSS via form fields */
function sanitize(str) {
    return str.replace(/[<>"'`]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c]));
}

/* FORM SUBMIT VALIDATION */
function showStatus(msg, isError = false) {
    statusMsg.textContent = msg;
    statusMsg.classList.remove('hidden', 'text-red-400', 'text-accentCyan');
    statusMsg.classList.add(isError ? 'text-red-400' : 'text-accentCyan');
    setTimeout(() => statusMsg.classList.add('hidden'), 5000);
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 🍯 Honeypot check — bots fill this, humans never see it
    const honeypot = document.getElementById("honeypot");
    if (honeypot && honeypot.value.length > 0) {
        console.log("Spambot detected. Submission blocked.");
        contactForm.reset();
        return;
    }

    // ⏱ Rate limit check
    if (isRateLimited()) {
        showStatus('⚠️ Too many submissions. Please wait a few minutes.', true);
        return;
    }

    // 🧹 Sanitize inputs before sending
    const nameField    = contactForm.querySelector('[name="from_name"]');
    const messageField = contactForm.querySelector('[name="message"]');
    nameField.value    = sanitize(nameField.value.trim());
    messageField.value = sanitize(messageField.value.trim());

    // Basic length validation
    if (nameField.value.length < 2) {
        showStatus('⚠️ Please enter a valid name.', true); return;
    }
    if (messageField.value.length < 10) {
        showStatus('⚠️ Message is too short.', true); return;
    }
    if (messageField.value.length > 2000) {
        showStatus('⚠️ Message is too long (max 2000 characters).', true); return;
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
        incrementRate();
        showStatus('✅ Message Sent Successfully!');
        contactForm.reset();
    })
    .catch((error) => {
        console.error('EmailJS error:', error);
        showStatus('❌ Failed to send. Please try again.', true);
    })
    .finally(() => {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Send Message';
    });
});
