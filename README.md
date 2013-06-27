nor-ui
======

JavaScript library composing user interfaces from RESTful web services

License
-------

MIT license.

Status
------

At the moment we are starting the work to port the library as an open source 
release.

We are using an initial version of the library in a private client project. 

Also part of the design is based on Sendanor's own ERP system which started 
back in 2007. This library will be part of the next generation ERP we're going 
to start working soon.

Features
--------

### Form building

* Forms can be embedded into HTML document without writing more JavaScript code
* Builds fully functional forms based on remote web resources
* Forms are composed based on rules from the remote web resource -- no need for client side input field designing
* Supports standard form elements (input, select, checkboxes)
* Supports file uploads
* Supports embedding Google Maps in a form (but keep in mind Google's Terms of Use!)

### Modal building

* Modals can be created with a single HTML div and a link/button

Examples
--------

A HTML document can use the library simply by:

```html
<h1>Example Form Application</h1>
<div class="form" data-action="resource.php"></div>
```

Where `resource.php` is a server side PHP script which when requested by:

* GET returns the resource as JSON object
* POST saves changes to the resource 
* PUT replaces the resource completely
* DELETE deletes the resource

See [our gist example](https://gist.github.com/jheusala/5875888) for full 
example code.

The implementation is not yet very pretty because the library code was shred 
from another private project and is using just a subset of features to put 
everything together for that specific project.

