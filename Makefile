# Refresh Mapping metadata directly from Google Sheets and verify its ZIPs.
.DEFAULT_GOAL := all
.PHONY: all download zip latest
all download zip latest:
	$(MAKE) -C _includes/metadata $@
