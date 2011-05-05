A simple sample WebApp that is empowered by

- Backbone.js
- CoffeeScript
- CouchDB

To use, make sure you are running couchdb, and a database named `todos` has
been created. Then simply open `index.html` with Safari. You must use Safari to
open it. No Chrome, no Firefox. This is due to stronger security requirement of
non-Safari browsers that prevents the script from loading data from CouchDB
without some configuration on the CouchDB side.

The code is pre-built. If you want to build on your own, run `make`. You must
have

- compass (`gem install compass`)
- coffee (`npm install coffee-script` after installing `node.js` and `npm`)

