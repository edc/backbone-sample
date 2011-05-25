A simple sample WebApp that is empowered by

- Backbone.js
- CoffeeScript
- CouchDB

## Usasge

There are two ways to run the sample, run it as a local application or run it as a couchApp.

#### Run as local application

Make sure you are running couchdb, and a database named `todos` has
been created. Then simply open `index.html` with Safari. You must use Safari to
open it. No Chrome, no Firefox. This is due to stronger security requirement of
non-Safari browsers that prevents the script from loading data from CouchDB
without some configuration on the CouchDB side.

#### Run as couchApp

A simple couchApp is included in the `todos` directory. It is created by
copying the HTML, JavaScript and CSS files to the `_attachement` folder of the
default couchApp.

Inside the `todos` directory, run `couchapp push`. You will see something like
this

	2011-05-25 10:37:33 [INFO] Visit your CouchApp here:
	http://127.0.0.1:5984/todos/_design/todos/index.html

Open that URL to see the app in action.

## Build the Application 

The code is pre-built. If you want to build on your own, run `make`. You must
have

- coffee (`npm install coffee-script` after installing `node.js` and `npm`)
- (optional) compass (`gem install compass`)
- (optional) haml (`gem install haml`)
