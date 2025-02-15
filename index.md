---
layout: default
title: AI Timeline
description: A comprehensive timeline of Artificial Intelligence milestones from 2022 to present.
---

<header class="header">
  <div class="github-button-container">
    <a href="https://github.com/NHLOCAL/AiTimeline" class="github-button" target="_blank" rel="noopener noreferrer" title="View on GitHub">
      <i class="fab fa-github"></i>
    </a>
  </div>
  <div class="dark-mode-toggle-container">
    <button id="dark-mode-toggle" class="dark-mode-toggle" title="Toggle dark/light mode">
      <i class="fas fa-moon"></i>
    </button>
  </div>
  <h1>Artificial Intelligence Timeline</h1>
  <h2>2022 - Present</h2>
</header>

<nav class="year-nav">
  <a href="#2022" class="active">2022</a>
  <a href="#2023">2023</a>
  <a href="#2024">2024</a>
  <a href="#2025">2025</a>
</nav>

<div class="sort-toggle-container">
  <button id="sort-toggle" class="sort-toggle" data-order="oldest" title="Sort timeline">
    <i class="fas fa-sort-amount-down"></i> Sort: Newest First
  </button>
</div>

<main class="timeline">

	{% for year in site.data.timeline %}
	<section class="year" id="{{ year.year }}">
	  <h2>{{ year.year }}</h2>
	  {% for event in year.events %}
	  <article id="{{ year.year }}-{{ event.date | replace: ' ', '-' }}" class="event" data-date="{{ event.date }}">
		<h3 class="date">{{ event.date | date: "%B" }}</h3>
		{% for info in event.info %}
		<p class="info {% if info.special %}special{% endif %}">{{ info.text }}</p>
		{% endfor %}
	  </article>
	  {% endfor %}
	</section>
	{% endfor %}

</main>

<aside class="footer">
    <div class="content">
        <h3>Learn more:</h3>
        <ul>
            {% for link in site.data.links %}
            <li><a href="{{ link.url }}" target="_blank">{{ link.text }}</a></li>
            {% endfor %}
        </ul>
    </div>
</aside>

<footer>
    {% include footer.html %}
</footer>

<script src="{{ '/assets/js/script.js' | relative_url }}" defer></script>