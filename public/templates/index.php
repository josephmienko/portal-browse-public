<?php

/**
 * INDEX PAGE
 *
 * This is the home page for the Data Portal browse UI. It is a long and manual template for
 * ease of use by team members who are familiar with HTML but not other templating technologies.
 * In future iterations, many of these pieces could be turned into partial templates included in
 * the same way as the header and nav (below).
 */
include_once('partials/header.php');
include_once('partials/home-nav.php');
include_once("analyticstracking.php");
?>

<?php
  /**
   * Banner section
   *
   * Uses the Materialize parallax banner image classes and JS for effect. Change the image below
   * as needed. Gulp is used to compress images and copy them to the /dist directory.
   */
?>
<section id="banner" class="parallax-container">
  <div class="container">
    <div class="banner-content">
      <h1>Child Welfare System Insights</h1>
      <h2>Our graphs, maps and reports showcase information about Washington State's child welfare system</h2>
      <form class="col s12 m6 search" id="search">
        <input type="search" id="search-input" />
        <label for="search-input">Search visualizations by keyword</label>
        <input type="submit" class="submit" value="Search"/>
      </form>
    </div>
    <div class="parallax">
      <img src="/dist/images/cover.jpg">
      <span class="overlay"></span>
    </div>
  </div>
</section>

<?php
  /**
   * Dashboard section
   *
   * Basic containers for the four dashboards. The markup and particularly the IDs are significant and
   * if altered will require changes to the JSON and JavaScript.
   *
   * The layout is an altered version of Materialize's tabs. They are taller and have basic tap-to-advance
   * functionality on mobile.
   */
?>
<section class="section row" id="dashboard">
  <ul class="tabs">
    <li class="col s12 m3 tab">
      <a href="#dash1">
        <span class="stat"></span>
        <p></p>
      </a>
    </li>
    <li class="col s12 m3 tab">
      <a href="#dash2">
        <span class="stat"></span>
        <p></p>
      </a>
    </li>
    <li class="col s12 m3 tab">
      <a href="#dash3">
        <span class="stat"></span>
        <p></p>
      </a>
    </li>
    <li class="col s12 m3 tab">
      <a href="#dash4">
        <span class="stat"></span>
        <p></p>
      </a>
    </li>
  </ul>
  <div class="row dashboard-container">
    <div id="dash1" class="row"></div>
    <div id="dash2" class="row"></div>
    <div id="dash3" class="row"></div>
    <div id="dash4" class="row"></div>
  </div>
</section>

<?php
  /**
   * Data source section
   *
   * There is very little text here, so it's currently hard coded. Change the class on the <i> elements
   * if you want to use a different Font Awesome icon.
   */
?>
<section class="section" id="data-source">
  <div class="container">
    <h3>Where does the data come from?</h3>
    <div class="row">
      <div class="col s12 m4">
        <i class="fa fa-university"></i>
        <h4>State Agencies</h4>
        <p>We work with the Washington State Department of Children, Youth & Families (DCYF) to obtain and analyze Washington State data</p>
      </div>
      <div class="col s12 m4">
        <i class="fa fa-file-text-o"></i>
        <h4>National Surveys</h4>
        <p>AFCARS and NYTD data give us critical context to what's going on close to home</p>
      </div>
      <div class="col s12 m4">
        <i class="fa fa-search"></i>
        <h4>In-House Research</h4>
        <p>Our Foster Parent Survey provides insight into the factors that affect families' chances of reunification</p>
      </div>
    </div>
    <div class="row btn-row">
      <a href="/about" class="btn btn-ghost">Learn More</a>
    </div>
  </div>
</section>

<?php
  /**
   * Explore section
   *
   * Card layout showing the 6 most recently changed visualizations. Change the counter if you want
   * to expand this section.
   */
?>
<section class="section" id="explore">
  <div class="container">
    <h3>Explore visualizations</h3>
      <div class="row">
        <?php 
          $i = 0;
          foreach($graphs as $graph){
        	if ($i <= 5 && trim($graph['meta']['title']) && $graph['meta']['visualizationType'] != 'report') { ?>
              <div class="col s12 m6 l4">
                <div class="card small <?php echo $graph['meta']['visualizationType']; ?>">
                  <div class="card-image waves-effect waves-block waves-light">
                    <a href="<?php echo $graph['type'] . $graph['meta']['slug']; ?>">
                      <span class="overlay"></span>
                      <span class="card-title title"><?php echo $graph['meta']['title']; ?></span>
                    </a>
                  </div>
                  <div class="card-content">
                      <?php if(array_key_exists('blurb', $graph['meta'])) { ?>
                      	<p><?php echo $graph['meta']['blurb']; ?></p>
                      <?php }?>
                  </div>
                  <div class="card-action">
                      <span class="url col s4">
                      <?php if(array_key_exists('externalURL', $graph['meta'])) { ?>
                        <a href="<?php echo $graph['meta']['externalURL']; ?>"><i class="fa fa-external-link"></i>View</a>
                      <?php } else { ?>
                        <a href="<?php echo 'http://' . $visURL . $graph['dir'] . $graph['meta']['slug']; ?>"><i class="fa fa-external-link"></i>View</a>
                      <?php } ?>
                      </span>
                      <span class="tag-info col s8">
                       <i class="fa fa-tag"></i>
                       <?php 
                        if(array_key_exists('tags', $graph['meta'])) {
                          echo $graph['meta']['tags'][0];
                        }
                      ?>
                      </span>
                  </div>
                </div>
              </div>
        <?php $i++; } } ?>
      </div>
      <div class="row btn-row">
      <a href="/browse" class="btn btn-large">See All Visualizations</a>
    </div>
  </div>
</section>
<?php include_once('partials/footer.php'); ?>
