---
layout: page
title: documentation
permalink: /documentation/

---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

## Data overview

The website draws on both <span id="document-count"></span> primary documents and <span id="bibliography-count"></span> secondary sources to present information about <span id="event-count"></span> <span id="composer-count"></span> composers, <span id="musician-count"></span> performing musicians, and <span id="nonmusician-count"></span> non-musicians. This list of composers gives a sense of coverage to date:

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

<br>

---

<br>

## Technical Documentation

### Events

The project is built on a relational database centered on **Events**. Each event records a person (or group) at a location at a specific time, backed by primary documents and secondary bibliography. Individual events may be linked to an institution and/or occasion.

Each event has an unique ID, called an **Event ID**. This ID enables each event to be cited through the creation of an unique and stable web address (e.g., [Event 3 places Josquin des Prez as a singer at the papal chapel](https://renaissancemapping.org/?eventid=00003).) The format of the ID citation is:

`https://renaissancemapping.org/` + `?eventid=` + the ID number (for Josquin, 00003)

or, in other words:

`https://renaissancemapping.org/?eventid=00003`

<br>

### Relational Database

The relational database is created through linked data on a series of Google Sheets, which track locations, biographical information, institutions, occasions, and bibliographic information. 

- **Events**  
  Whereabouts of individuals/groups at places over time; links out to all other sheets via IDs. Considers questions of certainty for events, locations, and people.

- **Locations (LOC)**  
  Location IDs like `LOC:City` or `LOC:City-Place` (ASCII only), with native-language names, Google Maps URLs, and coordinates. Ambiguous locations for events can be modeled via city-level locations or by creating multiple events.

- **Biographies – Composers (BCO) / Musicians (BMU) / Non-musicians (BNO)**  
  IDs in the form `PREFIX:Firstname_Lastname`. Include aliases, certain birth/death dates, roles/labels, and targeted bibliography. Entries for composers store DIAMM or RISM identifiers/links.

- **Institutions (INS)**  
  Musical/political/ecclesiastical institutions used to group people and events.

- **Occasions (OCC)**  
  Battles, treaties, natural disasters, meetings, and other non-person-centered happenings that can be linked to Events.

- **Document Entries (DOE)**  
  Document Entry IDs like `DOE:City_Archive_Number`. Link to archival documents, give type/subtype, metadata, related people and institutions, and point to a full text version and translation that are stored externally on GitHub. Where possible, entries include photos of the relevant archival documents.

- **Bibliography (BIB)**  
  Structured citations and, where relevant, page references. This information is cited by Events, Document Entries, and Biographies.

- **Headers**  
  A special sheet mapping verbose spreadsheet column names to concise JSON/JavaScript keys. This sheet enables team members to change headings  without breaking the technical implementation. This sheet is restricted and not user-facing.

<br>

#### Linking Data

Most connections use exact-match `VLOOKUP` against named ranges such as `Loc_ID`, `Bio_Comp_ID`, `Bio_Mus_ID`, and `Bib_ID`. For example, `=VLOOKUP("LOC:Vatican", Loc_ID, 1, FALSE)` looks for the location on the Location ID sheet for the Vatican, and returns the first column on that sheet (in this case, the name of the location ID).

<br>

### Website

#### Leaflet

This project uses [**Leaflet**](https://leafletjs.com) with the open-source base layer **OpenStreetMap** to render an interactive map of early-modern musical events. Markers represent individual events and update dynamically based on user selections and filters.

- **Marker Representation**  
  Events are rendered as `CircleMarker` elements with colors that change based on selected people, certainty flags, and date filters.

- **Marker Clustering**  
  Uses `Leaflet.MarkerCluster` to group dense areas of events. Cluster colors adapt to the colors of the markers inside them.

- **Search and Filtering**  
  A live search bar allows filtering by person, place, year, or event keywords. Selecting individuals recolors their events using a multi-hue palette and updates clusters, the sidebar, and the histogram. A synchronized sidebar lists all events currently visible on the map; clicking one zooms to its location.

<br>

#### GitHub

Files for the website for Mapping the Musical Renaissance are hosted on **GitHub** at [`https://github.com/benory/Renaissance-mapping-website`](https://github.com/benory/Renaissance-mapping-website)

Translations and transcriptions of document entries are stored in a separate repository: [`https://github.com/benory/Renaissance-mapping-data`](https://github.com/benory/Renaissance-mapping-data)

The website is served through [**GitHub pages**](https://pages.github.com) and uses the markdown language [**Jekyll**](https://jekyllrb.com).

<br>

#### Data

{% assign metadata_zip = site.static_files | where: "path", "/assets/metadata/metadata_latest.zip" | first %}

The full dataset used on this site is available [for download](/assets/metadata/metadata_latest.zip) {% if metadata_zip %} (last updated: {{ metadata_zip.modified_time | date: "%Y-%m-%d" }}).

{% else %}
*(Dataset ZIP not found — build may be stale.)*
{% endif %}
