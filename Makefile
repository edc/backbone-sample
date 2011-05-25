.PHONY: all

.SUFFIXES: .haml .html .scss .css .coffee .js

all: deploy

.haml.html:
	@if which haml; then haml -f html5 $< $@; else \
		echo "*haml not found. html will not be (re)built"; fi

.coffee.js:
	coffee -c $< 

deploy: index.html mvc.js
	@cd sass; if which compass; then compass compile; else \
		echo "*compass not found. SASS will not be (re)built"; fi
	cp index.html todos/_attachments/
	cp mvc.js todos/_attachments/
	cp -r lib todos/_attachments/
	cp -r stylesheets todos/_attachments/
