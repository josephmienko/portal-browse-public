<?php

require 'parsedown.php';

class Utils 
{

	/**
	 *  getContentList parses a given directory and returns an array of content items using
	 *  the provided path.
	 */
	function getContentList($path) {
	    $dir = new RecursiveDirectoryIterator($path);
	    $contentList = array();
	    foreach(new RecursiveIteratorIterator($dir) as $file){
	    	// Make sure that this is a file we actually want to parse
	        if($file->isFile() && $file->getExtension() == 'md' && $file->getFilename() != 'README.md'){
	            $relPath = $file->getPathInfo() . '/';

	            // Pages are not included in general content lists
	            if(strpos($relPath, 'pages') == false){
	                $contentList[$file->getFilename()] = $this->parseFileContents($relPath, $file->getFilename());
	            } else {
	                continue;
	            }
	        }
	    }
	    return $contentList;
	}

	/**
	 * getContentItem recursively searches the content directories for the currently requested item
	 * and returns an array of content and metadata for display on the current page.
	 */
	function getContentItem($path, $item, $args) {
	    $dir = new RecursiveDirectoryIterator($path);
	    $itemFile = $item . '.md';
	    foreach(new RecursiveIteratorIterator($dir) as $file){
	        if($file->isFile() && $file->getExtension() == 'md' && $file->getFilename() != 'README.md'){
	            if($args){
	            	$slug = $this->matchCurrentSlug($file);
	            	if($slug === $item) {
	            		$relPath = $file->getPathInfo() . '/';
	            		$currItem = $this->parseFileContents($relPath, $file->getFilename());
	            	}
	            }
	        }
	    }
	   return $currItem;
	}

	function matchCurrentSlug($path) {
		 $content = file_get_contents($path);

	    // Split off the metadata and return the slug
	    $content = explode("### Data Highlights", $content);
	    $meta = array_shift($content);
	    $meta    = json_decode($meta,true);
	    $slug  = $meta["slug"];
	    return $slug;
	}

	/** 
	 * @function getContentPage
	 *
	 * A much simpler function that gets a page assuming basic metadata and markdown content
	 */
	function getContentPage($path, $page) {
		 $dir = new RecursiveDirectoryIterator($path);
	    $pageFile = $page . '.md';
	    foreach(new RecursiveIteratorIterator($dir) as $file){
	        if($file->isFile() && $file->getFilename() == $pageFile){
	            $Parsedown = new Parsedown();
	    			$content = file_get_contents($path . '/' . $pageFile);
				   // Split apart the content and metadata information
				   $content = explode("\n\n", $content);
				   $meta = array_shift($content);
				   $meta    = json_decode($meta,true);
				   $content = implode("\n\n", $content);
				   $content = $Parsedown->text($content);
				   $pageArr = array('meta' => $meta, 'content' => $content);
	        }
	    }
	    return $pageArr;	
	}

	/**
	 *  parseFileContents looks for a specific file and parses the content of that file
	 *  into metadata, config, and content using json_decode for the meta/config info 
	 *  and Parsedown to read the content as markdown and return it as HTML.
	 *
	 *  @param $path - The directory where the application will find the content.
	 *  @param $filename - The name of the current file
	 */
	function parseFileContents($path, $filename) {
	    $Parsedown = new Parsedown();
	    $content = file_get_contents($path . '/' . $filename);

	    // Get some type and directory information
	    $relDir = str_replace('./content-data/content', '', $path);

	    if($relDir === '/reports/') {
	    	$type = $relDir;
	    } else {
	    	$type = '/visualizations/';
	    }

	    // Split apart the content, metadata and config information
	    $content = explode("### Data Highlights", $content);
	    $rawMeta = array_shift($content);
	    $processedMeta = preg_replace( "/\r|\n/", "", $rawMeta );
	    $meta    = json_decode($processedMeta,true);
	    $config  = $meta["config"];
	    $content = implode("\n\n", $content);
	    $content = $Parsedown->text($content);
	    $arr = array('dir' => $relDir, 'type' => $type, 'filename' => $filename, 'meta' => $meta, 'config' => $config, 'content' => $content);
	    return $arr;
	}


}