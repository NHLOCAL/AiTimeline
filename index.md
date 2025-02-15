---
layout: default
title: AI Timeline
description: A comprehensive timeline of Artificial Intelligence milestones from 2022 to present.
---

<header class="header">
    <div class="github-button-container">
        <a href="https://github.com/NHLOCAL/AiTimeline" class="github-button" target="_blank" rel="noopener noreferrer" title="Star on GitHub">
            <svg height="20" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="20" data-view-component="true"  class="octicon octicon-mark-github">
                <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
        </a>
    </div>
    <div class="dark-mode-toggle-container">
        <button id="dark-mode-toggle" class="dark-mode-toggle">🌙</button>
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