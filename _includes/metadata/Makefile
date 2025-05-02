##
## Programmer:    Benjamin Ory
## Syntax:        GNU Makefile
## Filename:      _includes/metadata/Makefile
##
## Description: Download metadata for the Mapping the Musical Renaissance from the Google Spreadsheet
##              for the project's metadata.  You need to update the SID variable below
##              when the deployment of the Google Apps Script has changed.
##
##              Type "make" in this directory to download the JSON files for the metadata.
##

##SID for relational database1
SID = AKfycbz8qVfP8Gx7Bf7dbQ_6bSbLm1t2clo4EGJWJOBgAQesU65HpfFBH98OPO8aQVw_oqFD

##SID for mapping target list
SID2 = AKfycbyPyBVCIbrTpDkMVMVZWRgE-c5xG1oAOGTgkmY_ee7yaIjmuiF59WuL0Sqi9LcpaiHA

all: download

download: Headers Events Occasions Institutions Doc_Entries Locations Bio_Composers Bio_Musicians Bio_Nonmusicians Archival_Docs Bibliography Targets

Headers:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Headers" > Headers.json

Events:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Events" > Events.json

Occasions:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Occasions" > Occasions.json

Institutions:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Institutions" > Institutions.json

Doc_Entries:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Doc_Entries" > Doc_Entries.json

Locations:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Locations" > Locations.json

Bio_Composers:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Bio_Composers" > Bio_Composers.json

Bio_Musicians:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Bio_Musicians" > Bio_Musicians.json

Bio_Nonmusicians:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Bio_Nonmusicians" > Bio_Nonmusicians.json

Archival_Docs:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Archival_Docs" > Archival_Docs.json

Bibliography:
	curl -L "https://script.google.com/macros/s/$(SID)/exec?sheet=Bibliography" > Bibliography.json

Targets:
	curl -L "https://script.google.com/macros/s/$(SID2)/exec?sheet=Targets" > Targets.json