<?php
 include_once('partials/header.php');
 include_once('partials/nav.php');
 include_once("analyticstracking.php");
?>

<div class="visualization">
  <div class="visualization-title <?php print($page['meta']['visualizationType']); ?>">
    <?php include_once('partials/content-title.php'); ?>
  </div>
  <div class="visualization-content container">
      <div class="row">
        <div class="col s12">
          <div class="view-btn">
          <?php if(array_key_exists('externalURL', $page['meta'])) { ?>
            <a class="btn" href="<?php print($page['meta']['externalURL']); ?>">View <?php echo $page['meta']['visualizationType']; ?></a>
          <?php } else { ?>
            <a class="btn" href="<?php print('http://' . $visURL . $page['dir'] . $page['meta']['slug']); ?>">View <?php echo $page['meta']['visualizationType']; ?></a>
          <?php } ?>
          </div>
          <div class="highlights-label">
            <h3>Data Highlights</h3>
            <span class="unit">
              <?php if(array_key_exists('unit', $page['meta'])) { 
                echo 'Unit: ' . $page['meta']['unit']; 
              } ?>
            </span>
          </div>
          <?php echo $page['content']; ?>
          <?php include_once('partials/content-footer.php'); ?>
        </div>
      </div>
  </div>
</div>
<?php include_once('partials/footer.php'); ?>