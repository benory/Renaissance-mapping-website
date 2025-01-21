---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<div class="search-bar">
    <input type="text" id="input" onkeyup="UserSearch()" placeholder="Enter person, place, year, or event">
    <span id="search-count"></span>
    <div class="checkbox-container">
        <div class="checkbox-item">
            <input type="checkbox" id="composer-select" name="composer-select" value="composer-select">
            <label for="composer-select">
                <span class="color-sample" style="background-color: #440154;"></span>
                View composers
            </label>
            <button class="dropdown-btn" onclick="toggleDropdown('composer-list')">▼</button>
        </div>
        <div class="active-names" id="composer-active"></div>
        <div class="checkbox-item">
            <input type="checkbox" id="musician-select" name="musician-select" value="musician-select">
            <label for="musician-select">
                <span class="color-sample" style="background-color: #23ed5c;"></span>
                View musicians
            </label>
            <button class="dropdown-btn" onclick="toggleDropdown('musician-list')">▼</button>    
        </div>
        <div class="active-names" id="musician-active"></div>
        <div class="checkbox-item">
            <input type="checkbox" id="non-musician-select" name="non-musician-select" value="non-musician-select">
            <label for="non-musician-select">
                <span class="color-sample" style="background-color: #fde725;"></span>
                View non-musicians
            </label>
            <button class="dropdown-btn" onclick="toggleDropdown('non-musician-list')">▼</button>
        </div>
        <div class="active-names" id="non-musician-active"></div>
        <div class="dropdown" id="composer-list">
            <div class="dropdown-description">Select one or more composers <br> (press escape to close)</div>
            <input type="text" class="dropdown-search" placeholder="Search composers..." onkeyup="filterDropdown('composer-list')">
            <div class="dropdown-items">
                <!-- Composer items will be dynamically populated here -->
            </div>
        </div>
        <div class="dropdown" id="musician-list">
            <div class="dropdown-description">Select one or more musicians <br> (press escape to close)</div>
            <input type="text" class="dropdown-search" placeholder="Search musicians..." onkeyup="filterDropdown('musician-list')">
            <div class="dropdown-items">
                <!-- Musician items will be dynamically populated here -->
            </div>
        </div>
        <div class="dropdown" id="non-musician-list">
            <div class="dropdown-description">Select one or more non-musicians <br> (press escape to close)</div>
            <input type="text" class="dropdown-search" placeholder="Search non-musicians..." onkeyup="filterDropdown('non-musician-list')">
            <div class="dropdown-items">
                <!-- Non-musician items will be dynamically populated here -->
            </div>
        </div>
    </div>
</div>
<div class="checkbox-item">
    <input type="checkbox" id="certainty-select" name="certainty-select" value="certainty-select">
    <label for="certainty-select">View only certain and probable events</label>
</div>

<div class="small-space"></div>

<div class="container">
    <div class="row">
        <div id="map"></div>
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
