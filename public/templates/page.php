<?php
 include_once('partials/header.php');
 include_once('partials/nav.php');
 include_once("analyticstracking.php");
?>

<div class="page">
  <div class="page-title">
    <?php include_once('partials/content-title.php'); ?>
  </div>
  <div class="page-content container">
      <div class="row">
        <div class="col s12">
          <?php echo $page['content']; ?>
        </div>
      </div>
  </div>
</div>
<?php include_once('partials/footer.php'); ?>