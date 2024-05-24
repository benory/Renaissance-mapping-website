##
## Programmer:    Benjamin Ory
## Syntax:        GNU Makefile
## Filename:      Makefile
## vim:           ts=3
##
## Description: Download metadata for the Mapping the Musical Renaissance from the Google Spreadsheet
##              for the project's metadata.  You need to update the SID variable in
##              _includes/metadata/Makefile when the deployment of the Google Apps
##              Script has changed.
##
##              Type "make" in this directory to download the JSON files for the 
##              metadata into the _includes/metadata directory.
##

all: download

download:
	(cd _includes/metadata && make download)