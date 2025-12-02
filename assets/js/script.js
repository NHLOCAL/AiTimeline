const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;


function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
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
    } else {
        if (systemPrefersDark) {
            body.classList.add('dark-mode');
            updateIcon(true);
        } else {
            body.classList.remove('dark-mode');
            updateIcon(false);
        }
    }
}

if (darkModeToggle) {
    initTheme();
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        updateIcon(isDark);
        setCookie("darkMode", isDark, 365);
    });
}


/* --- Scroll Spy / Active Year Logic --- */
const yearNavLinks = document.querySelectorAll('.year-nav a');
const yearSections = document.querySelectorAll('.year');

function highlightNav() {
    if (yearNavLinks.length === 0) return;

    // Get current visual order of sections (handling DOM reordering)
    const currentSections = Array.from(document.querySelectorAll('.year'));
    let currentYear = '';
    
    // Offset for the sticky header
    const scrollPos = window.pageYOffset + 140;

    // Logic: Iterate through sections. Since they are in DOM order (top to bottom),
    // the last section that has its top above the scrollPos is the active one.
    currentSections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            currentYear = section.getAttribute('id');
        }
    });

    // If we are at the very top and no section matches yet, highlight the first one
    if (!currentYear && currentSections.length > 0) {
        currentYear = currentSections[0].getAttribute('id');
    }

    yearNavLinks.forEach(link => {
        link.classList.remove('active');
        // Match href="#2025" with id="2025"
        if (link.getAttribute('href') === '#' + currentYear) {
            link.classList.add('active');
            
            // Optional: Auto-scroll the nav bar on mobile to keep active year in view
            link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });
}

window.addEventListener('scroll', highlightNav);
window.addEventListener('load', highlightNav);


/* --- Sort Toggle Logic --- */
const sortToggle = document.getElementById('sort-toggle');
if (sortToggle) {
    sortToggle.addEventListener('click', () => {
        const timelineContainer = document.querySelector('.timeline');
        // Get current state (default is now 'newest')
        const currentOrder = sortToggle.getAttribute('data-order') || 'newest';
        const newOrder = currentOrder === 'oldest' ? 'newest' : 'oldest';

        sortToggle.setAttribute('data-order', newOrder);

        const icon = sortToggle.querySelector('i');
        const textSpan = sortToggle.querySelector('span');

        if (newOrder === 'newest') {
            // If we switched TO Newest First, show option to go to Oldest
            icon.className = 'fas fa-sort-amount-up'; // Icon showing Ascending option (or stack up)
            textSpan.textContent = 'Oldest First';
        } else {
            // If we switched TO Oldest First, show option to go to Newest
            icon.className = 'fas fa-sort-amount-down'; // Icon showing Descending option
            textSpan.textContent = 'Newest First';
        }

        const yearSectionsArray = Array.from(timelineContainer.querySelectorAll('.year'));
        
        // Simply reverse the current DOM array and re-append
        yearSectionsArray.reverse().forEach(section => {
            timelineContainer.appendChild(section);
            // We also reverse the events within the year for consistency
            const events = Array.from(section.querySelectorAll('.event'));
            events.reverse().forEach(event => {
                section.appendChild(event);
            });
        });
        
        highlightNav();
    });
}


const scrollToTopBtn = document.getElementById('scroll-to-top');

if (scrollToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


document.addEventListener('click', function(e) {
    const btn = e.target.closest('.anchor-btn');
    if (!btn) return;

    const linkId = btn.getAttribute('data-link');
    if (!linkId) return;

    const fullUrl = window.location.origin + window.location.pathname + '#' + linkId;

    navigator.clipboard.writeText(fullUrl).then(() => {
        const icon = btn.querySelector('i');
        const originalClass = icon.className;

        icon.className = 'fas fa-check';
        icon.style.color = 'var(--milestone-color)';

        setTimeout(() => {
            icon.className = originalClass;
            icon.style.color = '';
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});