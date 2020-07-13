<!DOCTYPE html>
<html lang="en">

<head>
		<?php

		/*********************************************************************
		   This File:
			   ribbonTest.php
			   
			   
           For now this test page can be run using MAMP at this URL:

               http://orvilles-imac.local:8888/paraC/

		 *********************************************************************/

		$time = microtime(true);

		$datetime = new DateTime();
		$datetime->setTimestamp($time);
		$microSecs = $datetime->format('H:i:s:U');
		?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" media="all" href="./css/ribbon.css?r=<?= $microSecs ?>" />
</head>

    <body>
        <div id="ribbon">x</div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" defer></script>
        <script src="./js/ribbonToolbarTest.js?r=<?= $microSecs ?>" defer></script>
        <script src="./js/ribbonToolbar.js?r=<?= $microSecs ?>" defer></script>

        <span id="ribbonTextCheck"></span>
    </body>
</html>