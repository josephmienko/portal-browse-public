<p class="tags">
<i class="fa fa-tag"></i>
<?php
  if(array_key_exists('tags', $page['meta'])) {
  	 // Set a separator value and counter
  	 $sep = ',';
  	 $i = 0;
  	 // Loop over all of the tags and print them on the page
    foreach ($page['meta']['tags'] as $key => $value) {
    	// Change the separator if this is counter equals the length of the array
    	if(++$i == sizeof($page['meta']['tags'])) {
    		$sep = '';
    	}

      if($value != '') {
        echo '<a class="tag">' . $value . $sep . '</a>';
      }
    } 
  } 
?>
</p>
<p><a href="/browse" class="browse-back">Back to Browse</a></p>