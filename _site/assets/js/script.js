// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            this.textContent = '☀️';
        } else {
            this.textContent = '🌙';
        }
    });
}

// Navigation Active State for Index Page (Year Navigation)
const yearNavLinks = document.querySelectorAll('.year-nav a');
const yearSections = document.querySelectorAll('.year');

if (yearNavLinks.length > 0 && yearSections.length > 0) {
    window.addEventListener('scroll', () => {
        let currentYear = '';

        yearSections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.pageYOffset >= sectionTop) {
                currentYear = section.getAttribute('id');
            }
        });

        yearNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentYear) {
                link.classList.add('active');
            }
        });
    });
}

// Navigation Active State for Summary Page (Topic Navigation)
const topicNavLinks = document.querySelectorAll('.topic-nav a');
const topicSections = document.querySelectorAll('.topic-section');

if (topicNavLinks.length > 0 && topicSections.length > 0) {
    window.addEventListener('scroll', () => {
        let currentTopic = '';

        topicSections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.pageYOffset >= sectionTop) {
                currentTopic = section.getAttribute('id');
            }
        });

        topicNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentTopic) {
                link.classList.add('active');
            }
        });
    });
}
