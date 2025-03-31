document.addEventListener('DOMContentLoaded', () => {
  // --- Cookie Functions ---
  function setCookie(name, value, days) {
      var expires = "";
      if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
      }
      // Ensure baseurl is respected if necessary, but usually path=/ is sufficient
      const basePath = "/"; // Or derive from config if needed
      document.cookie = name + "=" + (value || "") + expires + "; path=" + basePath +"; SameSite=Lax";
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

  // --- Dark Mode ---
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
      const darkModeCookie = getCookie("darkMode");
      if (darkModeCookie === "true") {
          document.body.classList.add('dark-mode');
          darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for light mode option
      } else {
          darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for dark mode option
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

  // --- Timeline Navigation and Sorting ---
  const yearNavLinks = document.querySelectorAll('.year-nav a');
  const sortToggle = document.getElementById('sort-toggle');
  const timelineContainer = document.querySelector('.timeline');
  const offsetMargin = 150; // Adjust this value as needed (pixels from top)
  let scrollTimeout;

  // Function to update the active year link based on scroll position and sort order
  function updateActiveYearLink() {
      if (!timelineContainer) return; // Exit if timeline container not found

      const yearSections = timelineContainer.querySelectorAll('.year'); // Get sections in CURRENT DOM order
      if (yearSections.length === 0) return; // Exit if no year sections found

      let currentYearId = '';
      const scrollPosition = window.pageYOffset;
      const sortOrder = sortToggle ? (sortToggle.getAttribute('data-order') || 'oldest') : 'oldest';

      // Determine the active year based on scroll position
      for (let i = 0; i < yearSections.length; i++) {
          const section = yearSections[i];
          const sectionTop = section.offsetTop - offsetMargin;
          const sectionBottom = sectionTop + section.offsetHeight;

          // Logic: Find the section currently most prominent in the viewport near the offset margin
          // The last section whose top edge is above the scroll trigger point is generally the active one.
           if (scrollPosition >= sectionTop) {
               currentYearId = section.getAttribute('id');
           }
           // If we've scrolled past the bottom of this section, the *next* one might be active,
           // unless it's the last section. The loop naturally handles this by overwriting
           // currentYearId until the last valid section is found.
      }


      // Edge Case: Scrolled to the very top
      // If after checking all sections, currentYearId is still empty, or scroll is above the first section's trigger point
      if (!currentYearId && yearSections.length > 0 && scrollPosition < (yearSections[0].offsetTop - offsetMargin)) {
           // Activate the first section in the current DOM order
          currentYearId = yearSections[0].getAttribute('id');
      }
       // If still no ID (e.g., page load with weird state), default to first link maybe?
       // This should be rare with the above checks.

      // Update nav links appearance
      yearNavLinks.forEach(link => {
          link.classList.remove('active');
          if (currentYearId && link.getAttribute('href') === '#' + currentYearId) {
              link.classList.add('active');
          }
      });
  }

  // Scroll Event Listener (with Debounce)
  if (yearNavLinks.length > 0 && timelineContainer) {
      window.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(updateActiveYearLink, 50); // Debounce for performance
      });
  }

  // Sort Toggle Button Listener
  if (sortToggle && timelineContainer) {
      // Set initial button text based on default order (assuming 'oldest' is default HTML)
       // Or retrieve from a cookie if you want to persist sort order
       const initialOrder = sortToggle.getAttribute('data-order') || 'oldest';
       if (initialOrder === 'newest') {
           sortToggle.innerHTML = '<i class="fas fa-sort-amount-up"></i> Sort: Oldest First';
       } else {
           sortToggle.innerHTML = '<i class="fas fa-sort-amount-down"></i> Sort: Newest First';
       }


      sortToggle.addEventListener('click', () => {
          let currentOrder = sortToggle.getAttribute('data-order') || 'oldest';
          let newOrder = currentOrder === 'oldest' ? 'newest' : 'oldest';
          sortToggle.setAttribute('data-order', newOrder);

          // Update button text
          if (newOrder === 'newest') {
              sortToggle.innerHTML = '<i class="fas fa-sort-amount-up"></i> Sort: Oldest First';
          } else {
              sortToggle.innerHTML = '<i class="fas fa-sort-amount-down"></i> Sort: Newest First';
          }

          // Reorder the year sections in the DOM
          const yearSectionsNodes = Array.from(timelineContainer.querySelectorAll('.year'));
          yearSectionsNodes.reverse().forEach(section => {
              timelineContainer.appendChild(section);
              // Also reverse events within each year section for consistency
              const events = Array.from(section.querySelectorAll('.event'));
              events.reverse().forEach(event => {
                  section.appendChild(event);
              });
          });

          // CRITICAL: Update active link immediately after DOM change
          updateActiveYearLink();
           // Optional: Scroll slightly to ensure the newly active section is nicely positioned
           // const activeLink = document.querySelector('.year-nav a.active');
           // if (activeLink) {
           //     const targetSection = document.querySelector(activeLink.getAttribute('href'));
           //     if (targetSection) {
           //        // Simple scroll into view or more complex calculation
           //        // window.scrollTo({ top: targetSection.offsetTop - offsetMargin + 1, behavior: 'smooth' }); // May cause loop issues
           //     }
           // }
      });
  }

  // Initial update on page load
  if (yearNavLinks.length > 0 && timelineContainer) {
      // Small delay allows layout reflow, especially if images/fonts affect offsets
      setTimeout(updateActiveYearLink, 100);
  }

  // --- Navigation Active State for Summary Page (Topic Navigation) ---
  // (Keep this section if you have a summary page with topic navigation)
  const topicNavLinks = document.querySelectorAll('.topic-nav a');
  const topicSections = document.querySelectorAll('.topic-section');

  if (topicNavLinks.length > 0 && topicSections.length > 0) {
       let topicScrollTimeout;
      window.addEventListener('scroll', () => {
           clearTimeout(topicScrollTimeout);
           topicScrollTimeout = setTimeout(() => {
              let currentTopic = '';
              const topicScrollPosition = window.pageYOffset;
               const topicOffsetMargin = 200; // Separate offset for topic nav if needed

              topicSections.forEach(section => {
                  const sectionTop = section.offsetTop - topicOffsetMargin;
                  if (topicScrollPosition >= sectionTop) {
                      currentTopic = section.getAttribute('id');
                  }
              });

               // Handle top edge case for topic nav
               if (!currentTopic && topicSections.length > 0 && topicScrollPosition < (topicSections[0].offsetTop - topicOffsetMargin)) {
                   currentTopic = topicSections[0].getAttribute('id');
               }

              topicNavLinks.forEach(link => {
                  link.classList.remove('active');
                  if (currentTopic && link.getAttribute('href') === '#' + currentTopic) {
                      link.classList.add('active');
                  }
              });
          }, 50); // Debounce topic scroll as well
      });
       // Initial check for topic nav
       setTimeout(() => { // Similar delay for initial check
           let currentTopic = '';
           const topicScrollPosition = window.pageYOffset;
           const topicOffsetMargin = 200;
           topicSections.forEach(section => { /* ... same logic ... */ });
           if (!currentTopic && topicSections.length > 0 /* ... */) { /* ... */ }
           topicNavLinks.forEach(link => { /* ... */ });
       }, 100);
  }
});