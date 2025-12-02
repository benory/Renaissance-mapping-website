---
layout: page
title: documentation
permalink: /documentation/

---

{% include_relative styles-local.html %}
{% include_relative scripts-local.html %}

## Data overview

Mapping the Musical Renaissance draws on <span id="document-count"></span> primary documents and <span id="bibliography-count"></span> secondary sources to present information about the movements of <span id="composer-count"></span> composers, <span id="musician-count"></span> performing musicians, and <span id="nonmusician-count"></span> other prominent figures, including visual artists and political leaders--a total of <span id="event-count"></span> events. The following list of composers gives a sense of coverage to date:

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

The project is built on a relational database of what we call **Events**. Each event records a person (or group) in a specific location at a specific time. Individual events are sometimes linked to an institution or occasion.

Each event has an unique **Event ID** that makes it possible to cite the event via a stable web address (e.g., [Event 3 places Josquin des Prez as a singer at the papal chapel](https://renaissancemapping.org/?eventid=00003).) The format of the ID citation is:

`https://renaissancemapping.org/` + `?eventid=` + the ID number (for Josquin, 00003)

thus

`https://renaissancemapping.org/?eventid=00003`

<br>

### Relational Database

The relational database is created through linked data on a series of Google Sheets that track locations, biographical and bibliographical information, institutions, and occasions.

- **Events**  
  Whereabouts of individuals/groups at places over time; links to all other sheets via IDs. Considers questions of certainty for events, locations, and people.

- **Locations (LOC)**  
  Location IDs like `LOC:City` or `LOC:City-Place` (ASCII only), with native-language names, Google Maps URLs, and coordinates. Ambiguous locations for events can be modeled via city-level locations or by creating multiple events.

- **Biographies: Composers (BCO) / Musicians (BMU) / Non-musicians (BNO)**  
  IDs in the form `PREFIX:Firstname_Lastname` include aliases, certain birth and death dates, roles/labels, and targeted bibliography. Entries for composers store DIAMM or RISM identifiers/links.

- **Institutions (INS)**  
  People and events are grouped by musical, political, or ecclesiastical institution.

- **Occasions (OCC)**  
  Battles, treaties, natural disasters, public meetings, and other non-person-centered happenings that can be linked to Events.

- **Document Entries (DOE)**  
  Document Entry IDs like `DOE:City_Archive_Number` link to archival documents, give type/subtype, metadata, show related people and institutions, and point to a full text version and translation that are stored externally on GitHub. Where possible, entries include photos of the relevant archival documents.

- **Bibliography (BIB)**  
  Structured citations and, where relevant, page references. This information is cited by Events, Document Entries, and Biographies.

- **Headers**  
  A special restricted and not user-facing sheet that maps verbose spreadsheet column names to concise JSON/JavaScript keys and enables team members to change headings  without breaking the technical implementation. 

<br>

#### Linking Data

Most connections use exact-match `VLOOKUP` against named ranges such as `Loc_ID`, `Bio_Comp_ID`, `Bio_Mus_ID`, and `Bib_ID`. For example, `=VLOOKUP("LOC:Vatican", Loc_ID, 1, FALSE)` looks for the Vatican on the Location ID sheet and returns the first column on that sheet (in this case, the name of the location ID).

<br>

### Website

#### Leaflet

This project uses [**Leaflet**](https://leafletjs.com) with the open-source base layer **OpenStreetMap** to render an interactive map of early-modern musical events. Markers represent individual events and update dynamically based on user selections and filters.

- **Marker Representation**  
  Events are rendered as `CircleMarker` elements with colors that change based on selected people, certainty flags, and date filters.

- **Marker Clustering**  
  Uses `Leaflet.MarkerCluster` to group dense areas of events. Cluster colors adapt to the colors of the markers inside them.

- **Search and Filtering**  
  A live search bar allows filtering by person, place, year, and event keyword. Selecting multiple individuals recolors events associated with them using a multi-hue palette while updating clusters, the sidebar, and the histogram. A synchronized sidebar lists all events currently visible on the map; clicking on an event zooms to its location.

<br>

#### GitHub

Files for Mapping the Musical Renaissance are hosted on **GitHub** at [`https://github.com/benory/Renaissance-mapping-website`](https://github.com/benory/Renaissance-mapping-website)

Translations and transcriptions of document entries are stored in a separate repository: [`https://github.com/benory/Renaissance-mapping-data`](https://github.com/benory/Renaissance-mapping-data)

The website is served through [**GitHub pages**](https://pages.github.com) and uses the markdown language [**Jekyll**](https://jekyllrb.com).

<br>

#### Data

{% assign metadata_zip = site.static_files | where: "path", "/assets/metadata/metadata_latest.zip" | first %}

The site's full dataset is available [for download](/assets/metadata/metadata_latest.zip) {% if metadata_zip %} (last updated: {{ metadata_zip.modified_time | date: "%Y-%m-%d" }}).

{% else %}
*(Dataset ZIP not found — build may be stale.)*
{% endif %}
