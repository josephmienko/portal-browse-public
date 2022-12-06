<?php
 include_once('partials/header.php');
 include_once('partials/nav.php');
 include_once("analyticstracking.php");
?>

<div class="report">
  <div class="report-title">
    <?php include_once('partials/content-title.php'); ?>
  </div>
  <div class="report-content container">
      <div class="row">
        <div class="col s12">
          <?php echo $page['content']; ?>
          <div class="row">
            <div class="col s12 m6">
              <?php 
                if(array_key_exists('reports', $page['config'])) {
                  echo '<ul id="reports">';
                  foreach ($page['config']['reports'] as $key => $value) {
                    if($value != '') {
                      echo '<li><a href="/content-data/data/county-reports/' . $page['config']['report-prefix'] . $value .'.pdf">' . $value . '</a></li>';
                    }
                  } 
                  echo '</ul>';
                } 
              ?>
            </div>
          </div>
         <?php include_once('partials/content-footer.php'); ?>
        </div>
      </div>
  </div>
</div>
<?php include_once('partials/footer.php'); ?>