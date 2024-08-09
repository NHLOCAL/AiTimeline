const yearLinks = document.querySelectorAll('.year-nav a');
const yearSections = document.querySelectorAll('.year');

window.addEventListener('scroll', () => {
  let currentYear = '';

  yearSections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;

    if (window.pageYOffset >= sectionTop - windowHeight / 3 && window.pageYOffset < sectionTop + sectionHeight - windowHeight / 3) {
      currentYear = section.id;
    }
  });

  yearLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentYear) {
      link.classList.add('active');
    }
  });
});