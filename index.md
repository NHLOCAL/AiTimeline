---
layout: default
title: AI Timeline
description: A comprehensive timeline of Artificial Intelligence milestones from 2022 to present.
---

<header class="header">
  <h1>AI Timeline</h1>
  <h2>Tracking the evolution of Artificial Intelligence</h2>
  
  <a href="https://github.com/NHLOCAL/AiTimeline" class="github-cta" target="_blank" rel="noopener noreferrer" title="Support this project on GitHub">
    <i class="fab fa-github"></i> Star on GitHub
  </a>
</header>

<div class="sticky-bar">
  <nav class="year-nav">
    {% for year in site.data.timeline %}
    <a href="#{{ year.year }}">{{ year.year }}</a>
    {% endfor %}
  </nav>

  <div class="controls-container">
    <button id="sort-toggle" class="control-btn" data-order="oldest" title="Change timeline order">
      <i class="fas fa-sort-amount-down"></i> <span>Newest First</span>
    </button>
    <button id="dark-mode-toggle" class="control-btn" title="Toggle theme">
      <i class="fas fa-moon"></i>
    </button>
  </div>
</div>

<main class="timeline">

	{% for year in site.data.timeline %}
	<section class="year" id="{{ year.year }}">
	  <h2>{{ year.year }}</h2>
	  {% for event in year.events %}
	  <article id="{{ year.year }}-{{ event.date | replace: ' ', '-' }}" class="event" data-date="{{ event.date }}">
		<div class="date">{{ event.date | date: "%B" }}</div>
		{% for info in event.info %}
            {% if info.special %}
             <div class="info special" title="Major Industry Milestone">
                {{ info.text }}
             </div>
            {% else %}
             <div class="info">
                {{ info.text }}
             </div>
            {% endif %}
		{% endfor %}
	  </article>
	  {% endfor %}
	</section>
	{% endfor %}

</main>

<section class="resources-section">
    <h3>Enrichment Resources</h3>
    <ul class="resources-list">
        {% for link in site.data.links %}
        <li><a href="{{ link.url }}" target="_blank" rel="noopener noreferrer">{{ link.text }} <i class="fas fa-external-link-alt" style="font-size: 12px; margin-left: 5px; opacity: 0.5;"></i></a></li>
        {% endfor %}
    </ul>
</section>

<footer>
    {% include footer.html %}
</footer>

<button id="scroll-to-top" class="scroll-to-top" title="Back to top">
    <i class="fas fa-arrow-up"></i>
</button>

<script src="{{ '/assets/js/script.js' | relative_url }}" defer></script>