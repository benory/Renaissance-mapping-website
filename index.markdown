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
</div>
<div class="checkbox-item">
    <input type="checkbox" id="certainty-select" name="certainty-select" value="certainty-select">
    <label for="certainty-select">View only certain and probable events</label>
</div>
<div class="checkbox-item">
    <input type="checkbox" id="chronology-select" name="chronology-select" value="chronology-select">
    <label for="chronology-select">Filter by date</label>
</div>

<div class="small-space"></div>

<div id="map"></div>

<div class="small-space"></div>

<div class="slider-container">
    <div class="slider-wrapper">
        <span id="slider-start-label" class="slider-label"><b>1400</b></span>
        <input type="range" id="date-slider" min="1400" max="1600" value="1500" step="1" oninput="updateDateRange(this.value)">
        <span id="slider-active-label" class="slider-active-label">1500</span>
        <span id="slider-end-label" class="slider-label"><b>1600</b></span>
    </div>
    <span id="slider-date-range"></span>
</div>