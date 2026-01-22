---
layout: page
title: documentation
permalink: /documentation/
nav: true

---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

<h2>Documentation</h2>

<div class="doc-container">

<p><strong>Mapping the Musical Renaissance</strong> draws on <span id="document-count"></span> primary documents and <span id="bibliography-count"></span> secondary sources to present information about the movements of <span id="composer-count"></span> composers, <span id="musician-count"></span> performing musicians, and <span id="nonmusician-count"></span> other prominent figures, including visual artists and political leaders&mdash;a total of <span id="event-count"></span> events. The following list of composers gives a sense of coverage to date:</p>

<div class="targets-grid">
    <div class="targets-column">
        <h3>Complete</h3>
        <ul id="complete-targets" class="targets-list"></ul>
    </div>
    <div class="targets-column">
        <h3>Nearly Complete</h3>
        <ul id="nearly-targets" class="targets-list"></ul>
    </div>
</div>

<hr class="doc-divider">

<h2><strong>Technical Documentation</strong></h2>

<h3>Events</h3>

<p>The project is built on a relational database of what we call <strong>Events</strong>. Each event records a person (or group) in a specific location at a specific time. Individual events are sometimes linked to an institution or occasion.</p>

<p>Each event has an unique <strong>Event ID</strong> that makes it possible to cite the event via a stable web address (e.g., 
<a href="https://renaissancemapping.org/?eventid=00003" target="_blank">Event 3 places Josquin des Prez as a singer at the papal chapel</a>). The format of the ID citation is:</p>

<p><a href="https://renaissancemapping.org/?eventid=00003" target="_blank"><code>https://renaissancemapping.org/?eventid=00003</code></a></p>

<p>where <code>00003</code> is the numeric Event ID.</p>

<hr class="doc-divider">

<h3>Relational Database</h3>

<p>The relational database is created through linked data on a series of Google Sheets that track locations, biographical and bibliographical information, institutions, and occasions.</p>

<ul>
  <li>
    <strong>Events</strong> 
    <p>Whereabouts of individuals/groups at places over time; links to all other sheets via IDs. Considers questions of certainty for events, locations, and people.</p>
  </li>
  <li>
    <strong>Locations (LOC)</strong>  
    <p>Location IDs like <code>LOC:City</code> or <code>LOC:City-Place</code> (ASCII only), with native-language names, Google Maps URLs, and coordinates. Ambiguous locations for events can be modeled via city-level locations or by creating multiple events.</p>
  </li>
  <li>
    <strong>Biographies: Composers (BCO) / Musicians (BMU) / Non-musicians (BNO)</strong><p>IDs in the form <code>PREFIX:Firstname_Lastname</code> include aliases, certain birth and death dates, roles/labels, and targeted bibliography. Entries for composers store DIAMM or RISM identifiers/links.</p>
  </li>
  <li>
    <strong>Institutions (INS)</strong>
    <p>People and events are grouped by musical, political, or ecclesiastical institution.</p>
  </li>
  <li>
    <strong>Occasions (OCC)</strong>
    <p>Battles, treaties, natural disasters, public meetings, and other non-person-centered happenings that can be linked to Events.</p>
  </li>
  <li>
    <strong>Document Entries (DOE)</strong>
    <p>Document Entry IDs like <code>DOE:City_Archive_Number</code> link to archival documents, give type/subtype, metadata, show related people and institutions, and point to a full text version and translation that are stored externally on GitHub. Where possible, entries include photos of the relevant archival documents.</p>
  </li>
  <li>
    <strong>Bibliography (BIB)</strong>  
    <p>Structured citations and, where relevant, page references. This information is cited by Events, Document Entries, and Biographies.</p>
  </li>
  <li>
    <strong>Headers</strong> 
    <p>A special restricted and not user-facing sheet that maps verbose spreadsheet column names to concise JSON/JavaScript keys and enables team members to change headings  without breaking the technical implementation.</p>
  </li>
</ul>

<h4>Linking Data</h4>

<p>Most connections use exact-match <code>VLOOKUP</code> against named ranges such as <code>Loc_ID</code>, <code>Bio_Comp_ID</code>, <code>Bio_Mus_ID</code>, and <code>Bib_ID</code>. For example, <code>=VLOOKUP("LOC:Vatican", Loc_ID, 1, FALSE)</code> looks for the Vatican on the Location ID sheet and returns the first column on that sheet (in this case, the name of the location ID).</p>

<hr class="doc-divider">

<h3>Leaflet</h3>

<p>This project uses <a href="https://leafletjs.com" target="_blank"><strong>Leaflet</strong></a> with the open-source base layer <strong>OpenStreetMap</strong> to render an interactive map of early-modern musical events. Markers represent individual events and update dynamically based on user selections and filters.</p>

<ul>
  <li>
    <strong>Marker Representation</strong>
    <p>Events are rendered as <code>CircleMarker</code> elements with colors that change based on selected people, certainty flags, and date filters.</p>
  </li>
  <li>
    <strong>Marker Clustering</strong> 
    <p><code>Leaflet.MarkerCluster</code> to group dense areas of events. Cluster colors adapt to the colors of the markers inside them.</p>
  </li>
  <li>
    <strong>Search and Filtering</strong> 
    <p>A live search bar allows filtering by person, place, year, and event keyword. Selecting multiple individuals recolors events associated with them using a multi-hue palette while updating clusters, the sidebar, and the histogram. A synchronized sidebar lists all events currently visible on the map; clicking on an event zooms to its location.</p>
  </li>
</ul>

<hr class="doc-divider">

<h3>Github</h3>

<p>Files for <strong>Mapping the Musical Renaissance</strong> are hosted on <strong>GitHub</strong> at <a href="https://github.com/benory/Renaissance-mapping-website" target="_blank"><code>https://github.com/benory/Renaissance-mapping-website</code></a>.</p>

<p>Translations and transcriptions of document entries are stored in a separate repository: <a href="https://github.com/benory/Renaissance-mapping-data" target="_blank"><code>https://github.com/benory/Renaissance-mapping-data</code></a></p>

<p>The website is served through <a href="https://pages.github.com" target="_blank"><strong>GitHub pages</strong></a> and uses the markdown language <a href="https://jekyllrb.com" target="_blank"><strong>Jekyll</strong></a>.</p>

<hr class="doc-divider">

<h3>Data</h3>

{% assign metadata_zip = site.static_files | where: "path", "/assets/metadata/metadata_latest.zip" | first %}

<p>The site's full dataset is available <a href="/assets/metadata/metadata_latest.zip" target="_blank">for download</a> {% if metadata_zip %} (last updated: {{ metadata_zip.modified_time | date: "%Y-%m-%d" }}).

{% else %}
*(Dataset ZIP not found — build may be stale.)*
{% endif %}</p>

</div>