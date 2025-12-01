// Cookie Helpers
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Dark Mode Logic
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

function updateIcon(isDark) {
    if (!icon) return;
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

function initTheme() {
    const savedTheme = getCookie("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "true") {
        body.classList.add('dark-mode');
        updateIcon(true);
    } else if (savedTheme === "false") {
        body.classList.remove('dark-mode');
        updateIcon(false);
    } else if (systemPrefersDark) {
        body.classList.add('dark-mode');
        updateIcon(true);
    } else {
        updateIcon(false);
    }
}

if (darkModeToggle) {
    initTheme();
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        updateIcon(isDark);
        setCookie("darkMode", isDark, 30);
    });
}

// Sticky Nav Highlighting
const yearNavLinks = document.querySelectorAll('.year-nav a');
const yearSections = document.querySelectorAll('.year');

function highlightNav() {
    if (yearNavLinks.length === 0 || yearSections.length === 0) return;
    
    const scrollPos = window.pageYOffset + 200; // Trigger point
    let currentYear = '';

    yearSections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            currentYear = section.getAttribute('id');
        }
    });

    yearNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentYear) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNav);
window.addEventListener('load', highlightNav);

// Sorting Logic
const sortToggle = document.getElementById('sort-toggle');
if (sortToggle) {
    sortToggle.addEventListener('click', () => {
        const timelineContainer = document.querySelector('.timeline');
        const currentOrder = sortToggle.getAttribute('data-order') || 'oldest';
        const newOrder = currentOrder === 'oldest' ? 'newest' : 'oldest';
        
        sortToggle.setAttribute('data-order', newOrder);
        
        const icon = sortToggle.querySelector('i');
        const textSpan = sortToggle.querySelector('span');

        if (newOrder === 'newest') {
            icon.className = 'fas fa-sort-amount-up';
            textSpan.textContent = 'Oldest First';
        } else {
            icon.className = 'fas fa-sort-amount-down';
            textSpan.textContent = 'Newest First';
        }

        const yearSections = Array.from(timelineContainer.querySelectorAll('.year'));
        yearSections.reverse().forEach(section => {
            timelineContainer.appendChild(section);
            const events = Array.from(section.querySelectorAll('.event'));
            events.reverse().forEach(event => {
                section.appendChild(event);
            });
        });
        
        highlightNav();
    });
}

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}