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
        <label for="composer-select">
            <span class="color-sample" style="background-color: #440154;"></span>
            View composers
        </label>
    </div>
    <div class="checkbox-item">
        <input type="checkbox" id="musician-select" name="musician-select" value="musician-select">
        <label for="musician-select">
            <span class="color-sample" style="background-color: #23ed5c;"></span>
            View musicians
        </label>
    </div>
    <div class="checkbox-item">
        <input type="checkbox" id="non-musician-select" name="non-musician-select" value="non-musician-select">
        <label for="non-musician-select">
            <span class="color-sample" style="background-color: #fde725;"></span>
            View non-musicians
        </label>
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

<table class="histogram">
    <tr id="histogramRow"></tr>
</table>

<div class="slider-container">
    <div class="slider-wrapper">
        <span id="slider-start-label" class="slider-label"><b>1400</b></span>
        <div class="slider-highlighted-track"></div> <!-- The blue track -->
        <div class="slider-min-container">
            <input type="range" id="date-slider-min" min="1400" max="1600" value="1400" step="1" oninput="updateDateRange(); updateSliderBackground()">
        </div>
        <div class="slider-max-container">
            <input type="range" id="date-slider-max" min="1400" max="1600" value="1600" step="1" oninput="updateDateRange(); updateSliderBackground()">
        </div>
        <div class="slider-active-label-container">
            <span id="slider-start-active-label" class="slider-active-label-start">1400</span>
            <span id="slider-end-active-label" class="slider-active-label-end">1600</span>
        </div>
        <span id="slider-end-label" class="slider-label"><b>1600</b></span>
    </div>
    <span id="slider-date-range"></span>
</div>