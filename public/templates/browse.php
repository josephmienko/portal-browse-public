<?php
 
 include_once('partials/header.php');
 include_once('partials/nav.php');
 include_once("analyticstracking.php");
?>

<div class="browse">
  <div class="page-title">
    <h1>Browse Visualizations</h1>
    <p>Filter by type of visualization, tag, or keyword</p>
  </div>

    <!-- Filter bar -->
    <div class="filters">
      <div class="row filters-header">
        <div class="col s12 m4">
          <ul class="tabs">
            <li class="tab col s6 m2"><a href="#types">Type</a></li>
            <li class="tab col s6 m2"><a href="#tags">Tags</a></li>
          </ul>
        </div>
        <div class="col s12 m4">
          &nbsp;
        </div>
        <div class="col s12 m4">
          <div class="input-field">
            <input class="search" type="text" id="keyword-search"/>
            <label for="keyword-search">Filter by keyword</label>
          </div>
        </div>
      </div>
      <div class="row filters-body">
        <div class="container">
          <div id="types" class="col s12">
            <ul>        
                <li class="tag filter" data-value="graph" data-filters="type">graph</li>
                <li class="tag filter" data-value="map" data-filters="type">map</li>
                <li class="tag filter" data-value="report" data-filters="type">report</li>
            </ul>
          </div>
          <div id="tags" class="col s12">
             <ul>
                <?php

                	// Generates a list of all tags, reduces them to a unique array, and
                  // outputs them as HTML for filtering
                  $tags = [];

          				foreach($graphs as $graph) {
                    // Check for null meta so we skip content files with errors
                    if($graph['meta'] != null) {
            					if(array_key_exists('tags', $graph['meta'])) {
            						foreach ($graph['meta']['tags'] as $key => $value) {
            							if(!array_key_exists($value, $tags) && $value != '') {
            								array_push($tags, $value);
            							} else {
            								continue;
            							}
            						}
            					}
                    }
          				}

          				$uniqueTags = array_unique($tags);
                  sort($uniqueTags);

          				foreach($uniqueTags as $tag) {
          					echo '<li class="tag filter" data-filters="tag" data-value="' . 
          					      $tag . 
          					      '">' .
          					      $tag .
          					      '</li>';
  				}
  			?>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <?php
      /**
       * List of visualizations
       *
       * This div contains all of the visualizations; the ID is significant because it is used to instantiate
       * the keyword search and tag filters.
       */
    ?>
    <div id="visualizations" class="container">
      <p class="results"><span id="results">All Results</span> <a href="!#" id="showall">Show All</a></p>
      <div class="list row">
        <?php 
          sort($graphs);
          foreach($graphs as $graph){
        	if (trim($graph['meta']['title'])) { ?>
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

                    <?php
                     /**
                      *  The "vocabularies" div contains one element for each vocabulary with
                      *  a corresponding class. The div is hidden and used for the purpose of
                      *  filtering and searching.
                      */
                    ?>
                    <div class="vocabularies">
                     <p class="type"><?php echo $graph['meta']['visualizationType'];?></p>
                     <p class="tag">
                      <?php 
                      	if(array_key_exists('tags', $graph['meta'])) {
                      		foreach ($graph['meta']['tags'] as $key => $value) {
                      			echo $value;
                            echo "\n";
                      		}
                      	}
                      ?>
                      </p>
                      <p class="keyword">
                      <?php 
                        if(array_key_exists('keywords', $graph['meta'])) {
                          foreach ($graph['meta']['keywords'] as $key => $value) {
                            echo $value;
                            echo "\n";
                          } 
                        }
                      ?>
                      </p>
                    </div>
                  </div>
                  <div class="card-action">
                      <span class="url col s4">
                      <?php
                        /**
                         * "View" button uses an explicitly declared externalURL or defaults
                         * to the visURL set in the site config file.
                         */
                      ?>
                      <?php if(array_key_exists('externalURL', $graph['meta'])) { ?>
                        <a href="<?php echo $graph['meta']['externalURL']; ?>"><i class="fa fa-external-link"></i>View</a>
                      <?php } else { ?>
                        <a href="<?php $prefix = ($graph['meta']['visualizationType'] === 'report') ? '' : 'https://' . $visURL;
                                   echo $prefix . $graph['dir'] . $graph['meta']['slug']; ?>"><i class="fa fa-external-link"></i>View</a>
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
        <?php } } ?>
      </div>
    </div>
</div>
<?php include_once('partials/footer.php'); ?>