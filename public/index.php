<?php
/**
 * Index.php
 * 
 * This application uses the Slim microframework as a simple router that will
 * ingest content and generate a page per content file. Do NOT remove the next
 * three lines: they require the necessary files and instantiate the application.
 */
require 'app/autoload.php';
require 'app/utils.php';

$app = new Slim\Slim();

/**
 * Get and decode JSON config data
 * 
 * These URL values are used on the browse and visualization pages to render the correct
 * URL for the current instance. This makes it possible to have different URLs for local
 * and production copies of the site.
 */
$config = file_get_contents('config.json',0,null,null);
$configObj = json_decode($config, true);
$browseURL = $configObj['browseURL'];
$visURL = $configObj['visualizationsURL'];

/**
 *  Resource Paths and Helper Methods
 *
 *  This section defines where the application will find the templates and content
 *  for visualizations. 
 */

$app->config(array(
   'templates.path' => './templates',
   'content.path' => './content-data/content',
   'graph.path' => './content-data/content/graphs',
   'map.path' => './content-data/content/maps',
   'spaghettiplot.path' => './content-data/content/national-trends',
   'visURL' => $visURL,
   'browseURL' => $browseURL
));

/**
 *  Page Request Routes
 *  
 *  These are routes that define the pages of the application. Index and Browse are
 *  specific pages with their own templates, while most other pages represent high-
 *  level sections and accept an id as a parameter for rendering the page.
 */

$app->get('/', function () use ($app) {
    $Utils = new Utils();
    $path    = $app->config('content.path');
    $graphs = $Utils->getContentList($path);
    $visURL = $app->config('visURL');
    $app->render('index.php',array('graphs' => $graphs, 'visURL' => $visURL));
});

$app->get('/browse', function () use ($app) {
    $Utils = new Utils();
    $path    = $app->config('content.path');
    $graphs = $Utils->getContentList($path);
    $visURL = $app->config('visURL');
    $app->render('browse.php',array('graphs' => $graphs, 'visURL' => $visURL));
});

$app->get('/visualizations/:id', function ($visualization) use ($app) {
    $Utils = new Utils();
    $path    = $app->config('content.path');
    $relPath = '';
    $args = strpos($relPath, 'pages') == false && strpos($relPath, 'reports') == false;
    $visualization = $Utils->getContentItem($path, $visualization, $args);
    $visURL = $app->config('visURL');
    $app->render('visualization.php', array('page' => $visualization, 'visURL' => $visURL));
});

$app->get('/reports/:id', function ($report) use ($app) {
    $Utils = new Utils();
    $path    = $app->config('content.path');
    $relPath = '/reports/';
    $args = strpos($relPath, 'reports') == true;
    $report = $Utils->getContentItem($path, $report, $args);
    $visURL = $app->config('visURL');
    $app->render('report.php', array('page' => $report, 'visURL' => $visURL));
});

$app->get('/help/:id', function ($visualization) use ($app) {
    print('This is a help page');
});

$app->get('/:id', function ($page) use ($app) {
    $Utils = new Utils();
    $path    = './content-data/content/pages';
    $page = $Utils->getContentPage($path, $page);
    $app->render('page.php', array('page' => $page));
});

/**
 * Run the application
 *
 * This method should be called last. This executes the Slim application.
 */
$app->run();