A simple sample WebApp that is empowered by

- Backbone.js
- CoffeeScript
- CouchDB

To use, make sure you are running couchdb, and a database named `todos` is
created. Then simply open index.html. You must use Safari to open it. No
Chrome, no Firefox. This is due to stronger security requirement of non-Safari
browsers that prevents you the script from loading data from CouchDB without
some configuration on the CouchDB side.

To build, run `make`. You must have

- compass (gem install compass)
- coffee (npm install coffee-script)

