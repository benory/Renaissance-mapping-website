# Mapping the Musical Renaissance

**Mapping the Musical Renaissance** is a digital humanities project that traces the movements and interactions of musicians in the fifteenth and sixteenth centuries, bringing together heterogeneous evidence (primary and secondary sources) into a map-based interface so users can explore connections across people, places, and time. Each record is modeled as an **Event** (a person or group at a location within a date range) and can be cited through a stable event URL.

## Project Website

- Production site: [https://renaissancemapping.org](https://renaissancemapping.org)
- Site code (this repo): [https://github.com/benory/Renaissance-mapping-website](https://github.com/benory/Renaissance-mapping-website)
- Document transcriptions/translations: [https://github.com/benory/Renaissance-mapping-data](https://github.com/benory/Renaissance-mapping-data)

## Repository Overview

This repository is a Jekyll/GitHub Pages site. Content, metadata, and UI logic are separated into clear layers:

- **Pages and routing**
  - `index.markdown`: map interface homepage
  - `about/about.markdown`: About page
  - `documenation/documentation.markdown`: documentation page (directory name is intentionally `documenation/` in this repo)
  - `404.html`: custom not-found page

- **Layouts and shared includes**
  - `_layouts/default.html`: base page shell
  - `_layouts/map.html`: map-specific wrapper
  - `_includes/head.html`, `_includes/header.html`, `_includes/footer.html`: reusable site fragments

- **Metadata**
  - `_includes/metadata/*.json`: exported relational datasets (Events, Locations, Biographies, Institutions, Bibliography, etc.)
  - `assets/metadata/metadata_latest.zip`: downloadable packaged dataset
  - `_includes/metadata/Makefile`: metadata download + ZIP packaging pipeline

- **Map/UI scripts**
  - `scripts-local.html`: root script aggregator for the map page
  - `scripts-listeners.html`: startup hooks and UI event listeners
  - `scripts/app/state.html`: global state, metadata loading, shared constants
  - `scripts/app/lookup.html`: lookup-table/index utilities
  - `scripts/map/map-init.html`: Leaflet initialization, marker creation, popups
  - `scripts/map/clusters.html`: cluster color logic
  - `scripts/filters/filtering.html`: master filtering/search pass
  - `scripts/filters/visibility.html`: visibility helpers (checkboxes/certainty/institutions)
  - `scripts/ui/sidebar.html`: dynamic sidebar rendering/grouping
  - `scripts/ui/dropdown.html`: autocomplete + selected-person highlighting
  - `scripts/ui/histogram.html`: timeline histogram generation
  - `scripts/ui/slider.html`: date-range slider behavior
  - `scripts/ui/institutions.html`: institution popup/filter UI

- **Page-specific script/style wrappers**
  - Root: `scripts-local.html`, `scripts-listeners.html`, `styles-local.html`
  - About: `about/scripts-local.html`, `about/scripts-listeners.html`, `about/styles-local.html`
  - Documentation: `documenation/scripts-local.html`, `documenation/scripts-listeners.html`, `documenation/styles-local.html`

- **Styling and assets**
  - `assets/main.scss`: global theme styles
  - `styles-local.html`: map-page inline styles
  - `images/`: icons, graphics, and team headshots

## Local Development

### Prerequisites
- Ruby + Bundler
- Jekyll (installed through `bundle install`)

### Run locally
```bash
bundle install
bundle exec jekyll serve
