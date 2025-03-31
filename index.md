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


{% comment %} ... Header and Year Nav ... {% endcomment %}

</nav>

{% comment %} --- START: Color Legend --- {% endcomment %}
<div class="legend-container">
  <ul class="legend-list">
    <li class="legend-item">
      <span class="legend-color type-language"></span><span class="legend-label">Language Model</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-image"></span><span class="legend-label">Image Model</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-video"></span><span class="legend-label">Video Model</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-music"></span><span class="legend-label">Music Model</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-multimodal"></span><span class="legend-label">Multimodal</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-agent"></span><span class="legend-label">Agent/Tool</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-chatbot"></span><span class="legend-label">Chatbot</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-opensource"></span><span class="legend-label">Open Source</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-research"></span><span class="legend-label">Research</span>
    </li>
     <li class="legend-item">
      <span class="legend-color type-framework"></span><span class="legend-label">Framework</span>
    </li>
     <li class="legend-item">
      <span class="legend-color type-hardware"></span><span class="legend-label">Hardware</span>
    </li>
    <li class="legend-item">
      <span class="legend-color type-general"></span><span class="legend-label">General/Other</span>
    </li>
    <li class="legend-item special-marker-legend">
       <span class="legend-color special-event"></span><span class="legend-label">Significant Event</span>
    </li>
  </ul>
</div>
{% comment %} --- END: Color Legend --- {% endcomment %}

<div class="sort-toggle-container">
  <button id="sort-toggle" class="sort-toggle" data-order="oldest" title="Sort timeline">
    <i class="fas fa-sort-amount-down"></i> Sort: Newest First
  </button>
</div>

<main class="timeline">
	{% assign valid_years = site.data.timeline | where_exp: "item", "item.year != nil" %}
	{% for year in valid_years %}
	<section class="year" id="{{ year.year }}">
	  <h2>{{ year.year }}</h2>
	  {% assign events = year.events | default: empty %}
	  {% for event in events %}
	  <article id="{{ year.year }}-{{ event.date | replace: ' ', '-' }}" class="event" data-date="{{ event.date }}">
		<h3 class="date">{{ event.date | date: "%B" }}</h3>
        {% assign info_items = event.info | default: empty %}
		{% for info in info_items %}
        {% comment %} --- CHANGE HERE --- {% endcomment %}
        <p class="info
                  {% if info.type %}event-type-{{ info.type }}{% else %}event-type-general{% endif %}
                  {% if info.special %}special-event{% endif %}">
            {{ info.text }}
        </p>
        {% comment %} --- END CHANGE --- {% endcomment %}
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