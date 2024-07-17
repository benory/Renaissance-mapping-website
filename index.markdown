---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<div class="search-bar">
    <input type="text" id="input" onkeyup="UserSearch()" placeholder="Enter person, place, or event">
    <span id="search-count"></span>
    <div class="checkbox-container">
        <div class="checkbox-item">
            <input type="checkbox" id="composer-select" name="composer-select" value="composer-select">
            <label for="composer-select">View composers</label>
        </div>
        <div class="checkbox-item">
            <input type="checkbox" id="musician-select" name="musician-select" value="musician-select">
            <label for="musician-select">View musicians</label>
        </div>
        <div class="checkbox-item">
            <input type="checkbox" id="non-musician-select" name="non-musician-select" value="non-musician-select">
            <label for="non-musician-select">View non-musicians</label>
        </div>
    </div>
</div><br>

<div id="map"></div>