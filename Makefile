.PHONY: all

.SUFFIXES: .haml .html .scss .css .coffee .js

all: index.html mvc.js
	cd sass; compass compile

.haml.html:
	haml -f html5 $< $@

.coffee.js:
	coffee -c $< 
