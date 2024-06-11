---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: database

---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<div id="sheet-select">
	<span class="sheet-button selected" data-sheet="events">Events</span>
	<span class="sheet-button" data-sheet="documents">Document Entries</span>
</div>

<input type="text" id="input" onkeyup="UserSearch()" placeholder="Enter title, composer, source, or date"><span id="search-count"></span>

<div id="browse-interface">
	<div class="sheet-display" data-sheet="events">
		<div class="search-interface"></div>
		<div class="results-list"></div>
	</div>
	<div class="sheet-display hidden" data-sheet="documents">
		<div class="search-interface"></div>
		<div class="results-list"></div>
	</div>
</div>