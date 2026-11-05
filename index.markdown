---
layout: map
hide_footer: true

---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<div class="container">
    <div class="map-stage">
        <div class="top-overlay">
            <div class="top-grid">
                <div class="left-column">
                    <div class="search-row">
                        <div class="search-wrapper">
                            <input type="text" id="input"
                                   onkeyup="filterAndSearchMarkers(); showAutocompleteSuggestions()"
                                   placeholder="Enter person, place, year, or event">
                            <div id="autocomplete-results" class="autocomplete-results"></div>
                        </div>
                    </div>
                    <div class="selected-names-bar">
                        <div id="location-active" class="active-names inline-active-location"></div>
                        <div id="composer-active" class="active-names"></div>
                        <div id="musician-active" class="active-names"></div>
                        <div id="non-musician-active" class="active-names"></div>
                    </div>
                </div>
                <div class="right-column">
                    <div class="custom-dropdown" id="date-dropdown">
                        <button id="date-button" class="with-arrow apple-pill-button" aria-expanded="false">
                            <img src="/images/calendar.svg" alt="" class="map-filter-icon" aria-hidden="true">
                            <span class="date-button-label">Dates</span>
                        </button>
                        <div class="date-popup">
                            <div class="date-input-row">
                                <label>
                                    From
                                    <input type="number" id="date-input-min" min="1400" max="1600" placeholder="<1400">
                                </label>
                                <label>
                                    To
                                    <input type="number" id="date-input-max" min="1400" max="1600" placeholder="1600">
                                </label>
                            </div>
                            <div class="date-actions">
                                <button class="date-reset">Reset</button>
                                <button class="date-apply">Apply</button>
                            </div>
                        </div>
                    </div>
                    <div class="checkbox-container">
                        <div class="checkbox-item">
                            <input type="checkbox" id="composer-select">
                            <label for="composer-select">
                                <span class="color-sample" style="background-color: #440154;"></span>
                                Composers
                            </label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="musician-select">
                            <label for="musician-select">
                                <span class="color-sample" style="background-color: #23ed5c;"></span>
                                Other musicians
                            </label>
                        </div>
                        <div class="checkbox-item">
                            <input type="checkbox" id="non-musician-select">
                            <label for="non-musician-select">
                                <span class="color-sample" style="background-color: #fde725;"></span>
                                Non-musicians
                            </label>
                        </div>
                        <label class="certainty-filter">
                            <input type="checkbox" id="certainty-select" role="switch">
                            <span class="certainty-switch-track" aria-hidden="true"></span>
                            <span>Certain &amp; probable events only</span>
                        </label>
                    </div>
                    <div class="custom-dropdown" id="institution-dropdown">
                        <button id="institution-button" class="apple-pill with-arrow">Institutions</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div id="sidebar">
                <div class="sidebar-table-wrapper">
                    <table id="active-markers-table">
                        <thead>
                            <tr>
                                <th scope="col" id="search-count">Events shown on map</th>
                            </tr>
                        </thead>
                        <tbody id="sidebar-composers-a"></tbody>
                        <tbody id="sidebar-composers-b"></tbody>
                        <tbody id="sidebar-composers-other"></tbody>
                        <tbody id="sidebar-musicians"></tbody>
                        <tbody id="sidebar-nonmusicians"></tbody>
                    </table>
                </div>
                <button
                    id="toggle-histogram-btn"
                    class="histogram-toggle"
                    aria-expanded="true">
                    Hide histogram and timeline
                </button>
            </div>
            <div id="map"></div>
        </div>
        <section class="histogram-container" id="histogram-panel" aria-labelledby="histogram-title">
            <h2 class="histogram-title" id="histogram-title">Events by decade</h2>
            <div class="histogram-chart">
                <div class="histogram-scale" aria-hidden="true">
                    <span id="histogram-max-label"></span>
                    <span id="histogram-mid-label"></span>
                </div>
                <table class="histogram" aria-label="Event counts by decade">
                    <tr id="histogramRow"></tr>
                </table>
            </div>
            <div class="slider-container">
                <div class="slider-wrapper" id="timeline-slider" role="group" aria-label="Date range">
                    <div class="timeline-slider-track"></div>
                    <div class="timeline-slider-selected-track" id="timeline-slider-selected-range"></div>
                    <button type="button" role="slider" id="timeline-slider-thumb-min" class="timeline-slider-thumb" aria-label="Start year"></button>
                    <button type="button" role="slider" id="timeline-slider-thumb-max" class="timeline-slider-thumb" aria-label="End year"></button>
                    <div class="slider-active-label-container" aria-hidden="true">
                        <span id="slider-start-active-label">1400</span>
                        <span id="slider-end-active-label">1600</span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
