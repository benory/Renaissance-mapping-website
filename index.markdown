---
layout: map
---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<script async src="https://www.googletagmanager.com/gtag/js?id=G-E9SL07ZJ25"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-E9SL07ZJ25');
</script>
<div class="container">
    <div class="map-stage">
        <div class="top-overlay">
            <div class="top-grid">
                <!-- Column 1: search + certainty -->
                <div class="left-column">
                    <div class="search-row">
                      <div class="search-stack">
                        <div class="search-wrapper">
                          <input type="text" id="input"
                                 onkeyup="filterAndSearchMarkers(); showAutocompleteSuggestions()"
                                 placeholder="Enter person, place, year, or event">
                          <div id="autocomplete-results" class="autocomplete-results"></div>
                        </div>
                      </div>
                      <!-- institutions button moves to the RIGHT of the search bar -->
                      <div class="custom-dropdown" id="institution-dropdown">
                        <button id="institution-button" class="with-arrow">Institutions
                        </button>
                      </div>
                      <div class="custom-dropdown" id="certainty-dropdown">
                          <button
                            id="certainty-button"
                            class="with-arrow apple-pill-button"
                            aria-expanded="false">
                            All events
                          </button>
                          <div class="certainty-popup">
                            <ul class="certainty-list">
                              <li data-value="all" class="active">All events</li>
                              <li data-value="certain">Certain &amp; probable only</li>
                            </ul>
                          </div>
                      </div>
                      <input type="checkbox" id="certainty-select" hidden>
                    </div>
                </div>
                <!-- Column 3: EMPTY — grid handles it -->
                <div></div>
                <!-- Column 4: right aligned checkboxes -->
                <div class="right-column">
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
                    </div>
                </div>
            </div>
            <div class="selected-names-bar">
                <div id="composer-active" class="active-names"></div>
                <div id="musician-active" class="active-names"></div>
                <div id="non-musician-active" class="active-names"></div>
            </div>
        </div>
        <div class="row">
            <div id="sidebar">
                <div class="sidebar-table-wrapper">
                    <table id="active-markers-table">
                        <thead>
                            <tr>
                                <th><span id="search-count" class="search-count"></span>Shown on Map</th>
                            </tr>
                        </thead>
                        <tbody id="sidebar-composers"></tbody>
                        <tbody id="sidebar-musicians"></tbody>
                        <tbody id="sidebar-nonmusicians"></tbody>
                    </table>
                </div>
                <button
                    id="toggle-histogram-btn"
                    class="histogram-toggle"
                    aria-expanded="false">
                    Show histogram and timeline
                </button>
            </div>
            <div id="map"></div>
        </div>
        <div class="histogram-container" id="histogram-panel">
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
</div>