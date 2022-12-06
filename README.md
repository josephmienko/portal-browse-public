# Portal Browse

## Project Purpose

This project provides a simple access method for Data Portal visualizations as well as 
a tabbed dashboard that answers commonly aasked quetions about child welfare in Washington.

## Implementation Overview

This project is implemented as a very simple set of PHP templates that transform Markdown
files to HTML. The files are also used to provide content and configuation information to
the visualizations.

### Folder Structure

The project is set up with templates, content and data in the `/public` folder and CSS, Sass, Javascript and image assets in `/src`. Content and data are ignored within this repo and must be cloned into the `public` folder from https://github.com/cssat/portal-content.git and https://github.com/cssat/portal-data.git

**Assets at the root of this repo include:**

* `gulpfile.js`: The Gulpfile contains tasks that concatenate, compress, and output CSS/ Javascript files into the `public/dist` folder. The `gulp watch` task rebuilds these assets whenever you change a file and the `gulp` task builds everything at once (including image compression)

* `package.json`: a list of dependencies for working with Sass and Javascript files. These get installed when you run `npm install`

* `Vagrantfile`: a configuration file for Vagrant if you choose to use a VM instead of local server software

**Inside the src folder:**

* css: Minified CSS files that result from the Gulp build

* font: probably deprecated, but need to test it

* images: the banner image and logos for the site

* js: Javascript files. These are split into modules that are included and initialized in app.js

* sass: Sass partials to keep CSS easier to manage. These get included in styles.scss and then processed as minfied CSS files

* vendor: plugins and frameworks that support the site's styles and functionality

**Inside the public folder:**

* app: The Slim PHP files that power the templating system

* content and data: Included repos with the specific content and data files for the different visualizations

* dist: optimized CSS, Javascript and image assets

* templates: PHP templates and partials for each view of the site. When you need to add a new type of page layout, you will also need to add a new template.

* .htaccess file: enables URL rewriting. **This is necessary for the site to run**

* config.json: **Must be added** There is a sample in config.json.sample
