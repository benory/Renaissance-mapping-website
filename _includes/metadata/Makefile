# Mapping's independent direct-CSV downloader and ZIP packager.
SHEET_TOOLS ?= ../../../digital-projects-tools/sheet-downloads
SHEET_PYTHON ?= python3
DATE := $(shell date +%Y-%m-%d)
DOWNLOAD = $(SHEET_PYTHON) "$(SHEET_TOOLS)/download.py" --config "$(SHEET_TOOLS)/config/mapping.json" --website "$(abspath ../..)"
TABLES = Headers Events Occasions Institutions Doc_Entries Locations Bio_Composers Bio_Musicians Bio_Nonmusicians Archival_Docs Bibliography Targets

.PHONY: all download zip latest $(TABLES)
# One locked operation: validate every table before replacing data or packaging.
all:
	$(DOWNLOAD) --zip --date "$(DATE)"
download:
	$(DOWNLOAD)
$(TABLES):
	$(DOWNLOAD) --table "$@"
zip:
	$(DOWNLOAD) --zip-only --date "$(DATE)"
# Packaging creates dated and latest archives together, with identical contents.
latest: zip
