---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page

---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<div id="sheet-select">
	<span class="sheet-button selected" data-sheet="Events">Events</span>
	<span class="sheet-button" data-sheet="Documents">Document Entries</span>
</div>

<input type="text" id="input" onkeyup="UserSearch()" placeholder="Enter person, place, or event"><span id="search-count"></span>

<div id="browse-interface">
	<div class="sheet-display" data-sheet="Events">
		<div class="search-interface"></div>
		<div class="results-list"></div>
	</div>
	<div class="sheet-display hidden" data-sheet="Documents">
		<div class="search-interface"></div>
		<div class="results-list"></div>
	</div>
</div>