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


const yearNavLinks = document.querySelectorAll('.year-nav a');

function highlightNav() {
    if (yearNavLinks.length === 0) return;

    const currentSections = Array.from(document.querySelectorAll('.year:not(.hidden)'));
    let currentYear = '';

    // Adjust offset to match CSS scroll-margin-top (~155px)
    // We add a bit more (e.g. 180) so highlighting happens when the year header is well into view
    const scrollPaddingTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-scroll-padding'), 10) || 155;
    const scrollPos = window.pageYOffset + scrollPaddingTop + 25;

    currentSections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            currentYear = section.getAttribute('id');
        }
    });

    if (!currentYear && currentSections.length > 0) {
        currentYear = currentSections[0].getAttribute('id');
    }

    yearNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentYear) {
            link.classList.add('active');


        }
    });
}

window.addEventListener('scroll', highlightNav);
window.addEventListener('load', highlightNav);


const sortToggle = document.getElementById('sort-toggle');
if (sortToggle) {
    sortToggle.addEventListener('click', () => {
        const timelineContainer = document.querySelector('.timeline');
        const currentOrder = sortToggle.getAttribute('data-order') || 'newest';
        const newOrder = currentOrder === 'oldest' ? 'newest' : 'oldest';

        sortToggle.setAttribute('data-order', newOrder);
        const icon = sortToggle.querySelector('i');

        if (newOrder === 'newest') {
            icon.className = 'fas fa-sort-amount-up';
        } else {
            icon.className = 'fas fa-sort-amount-down';
        }

        const yearSectionsArray = Array.from(timelineContainer.querySelectorAll('.year'));
        yearSectionsArray.reverse().forEach(section => {
            timelineContainer.appendChild(section);
            const events = Array.from(section.querySelectorAll('.event'));
            events.reverse().forEach(event => {
                section.appendChild(event);
            });
        });

        highlightNav();
    });
}



const searchInput = document.getElementById('event-search');
const significantFilter = document.getElementById('filter-significant');


let activeFilters = {
    search: '',
    special: false
};

// Initialize: Cache original HTML content for each info item to allow safe highlight reset
const allInfoItems = document.querySelectorAll('.info');
allInfoItems.forEach(item => {
    item.setAttribute('data-original-html', item.innerHTML);
});

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function filterEvents() {
    const years = document.querySelectorAll('.year');

    years.forEach(year => {
        let hasVisibleEventsInYear = false;
        const events = year.querySelectorAll('.event');

        events.forEach(event => {
            let hasVisibleItemsInEvent = false;
            const items = event.querySelectorAll('.info');

            items.forEach(item => {

                const originalHTML = item.getAttribute('data-original-html');


                const isSpecial = item.getAttribute('data-special') === 'true';
                const textContent = item.innerText.toLowerCase();
                const searchMatch = activeFilters.search === '' || textContent.includes(activeFilters.search);
                const specialMatch = !activeFilters.special || isSpecial;

                if (searchMatch && specialMatch) {
                    item.classList.remove('hidden');
                    hasVisibleItemsInEvent = true;


                    if (activeFilters.search !== '') {
                        // Safe highlight: Match text not inside HTML tags
                        try {
                            const term = escapeRegExp(activeFilters.search);
                            // Regex looks for the term, ensuring it's not followed by `>` without a `<` first (rudimentary tag avoidance)

                            const regex = new RegExp(`(${term})(?![^<]*>)`, 'gi');
                            item.innerHTML = originalHTML.replace(regex, '<span class="highlight-text">$1</span>');
                        } catch (e) {
                            item.innerHTML = originalHTML;
                        }
                    } else {
                        item.innerHTML = originalHTML;
                    }

                } else {
                    item.classList.add('hidden');

                    item.innerHTML = originalHTML;
                }
            });


            if (hasVisibleItemsInEvent) {
                event.classList.remove('hidden');
                hasVisibleEventsInYear = true;
            } else {
                event.classList.add('hidden');
            }
        });


        if (hasVisibleEventsInYear) {
            year.classList.remove('hidden');
        } else {
            year.classList.add('hidden');
        }
    });

    highlightNav();
}

if (searchInput) {
    // Stop browser defaults (history back / page scroll) when user hits delete/backspace on an empty search box.
    searchInput.addEventListener('keydown', (e) => {
        const isEraseKey = e.key === 'Backspace' || e.key === 'Delete';
        if (!isEraseKey) return;

        const value = searchInput.value;
        const isEmpty = value.length === 0;
        // Only block when there is truly nothing to delete; allow normal deletion when text exists (even if all selected)
        if (!isEmpty) return;

        e.preventDefault();
        e.stopPropagation();
    });

    searchInput.addEventListener('input', (e) => {
        const next = e.target.value.toLowerCase().trim();
        if (next === activeFilters.search) return; // no content change -> avoid unnecessary reflow
        activeFilters.search = next;
        filterEvents();
    });
}

if (significantFilter) {
    significantFilter.addEventListener('click', () => {
        activeFilters.special = !activeFilters.special;

        const icon = significantFilter.querySelector('i');
        if (activeFilters.special) {
            significantFilter.classList.add('active');
            icon.className = 'fas fa-star';
        } else {
            significantFilter.classList.remove('active');
            icon.className = 'far fa-star';
        }

        filterEvents();
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
