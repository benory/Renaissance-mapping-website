---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<div class="search-bar">
    <div style="position: relative; display: inline-block; width: 67%;">
  <input type="text" id="input" onkeyup="filterAndSearchMarkers(); showAutocompleteSuggestions()" placeholder="Enter person, place, year, or event">
      <div id="autocomplete-results" class="autocomplete-results"></div>
    </div>
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
<div class="selected-names-bar">
    <div id="composer-active" class="active-names"></div>
    <div id="musician-active" class="active-names"></div>
    <div id="non-musician-active" class="active-names"></div>
</div>
<div class="checkbox-item">
    <input type="checkbox" id="certainty-select" name="certainty-select" value="certainty-select">
    <label for="certainty-select">View only certain and probable events</label>
</div>

<div class="small-space"></div>

<div class="container">
    <div class="row">
        <div id="sidebar">
            <div id="sidebar">
                <table id="active-markers-table">
                        <thead>
                            <tr>
                                <th>Events Shown on Map<br>(click to select event)</th>
                            </tr>
                        </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
        <div id="map"></div>
    </div>
    <div class="small-space"></div>
    <div class="histogram-container">
        <table class="histogram">
            <tr id="histogramRow"></tr>
        </table>
        <div class="slider-container">
            <div class="slider-wrapper">
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
            </div>
            <span id="slider-date-range"></span>
    </div>
</div>
