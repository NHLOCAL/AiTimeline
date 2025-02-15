// פונקציות עזר לעבודה עם עוגיות
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
  // Dark Mode Toggle with Cookie Support and Font Awesome icons
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    // בטעינת הדף - בדיקה האם עוגית darkMode קיימת
    const darkModeCookie = getCookie("darkMode");
    if (darkModeCookie === "true") {
      document.body.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    darkModeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        setCookie("darkMode", "true", 30);
      } else {
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        setCookie("darkMode", "false", 30);
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


// Sort Toggle Button with Font Awesome icons
const sortToggle = document.getElementById('sort-toggle');
if (sortToggle) {
  sortToggle.addEventListener('click', () => {
    const timelineContainer = document.querySelector('.timeline');
    
    let currentOrder = sortToggle.getAttribute('data-order') || 'oldest';
    let newOrder = currentOrder === 'oldest' ? 'newest' : 'oldest';
    sortToggle.setAttribute('data-order', newOrder);
    
    if (newOrder === 'newest') {
      sortToggle.innerHTML = '<i class="fas fa-sort-amount-up"></i> Sort: Oldest First';
    } else {
      sortToggle.innerHTML = '<i class="fas fa-sort-amount-down"></i> Sort: Newest First';
    }
    
    const yearSections = Array.from(timelineContainer.querySelectorAll('.year'));
    yearSections.reverse().forEach(section => {
      timelineContainer.appendChild(section);
      const events = Array.from(section.querySelectorAll('.event'));
      events.reverse().forEach(event => {
        section.appendChild(event);
      });
    });
  });
}


