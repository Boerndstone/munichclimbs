<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
<meta http-equiv="x-ua-compatible" content="ie=edge" />
<meta name="author" content="Bernd Ullmann">
<meta name="robots" content="index,follow">

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-113022905-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-113022905-1');
</script>

<?php 
	if(isset($_GET['gebiet'])) { 
		$show_rocks = $area->showRocksArea($_GET['gebiet']);
?>
	<meta name="description" content="Klettern rund um München. Auf dieser Seite sollen die Klettergebiete um München vorgestellt werden.">
	<meta name="keywords" content="<?php while($rocksData = $show_rocks->fetch()) { echo $rocksData['rockName'] . ', '; } ?>">
<?php } elseif(isset($_GET['fels'])) { 

		$show_routes 		= $rocks->showRoutesRock($_GET['fels']);
		$rocksDescription 	= $rocks->get_title_of_rock($_GET['fels']);

		while($getTitle = $rocksDescription->fetch()) {
			$description = $getTitle['rockDescription'];
		}
?>
	<meta name="description" content="<?php echo str_replace('_', ' ', $_GET['fels']); ?>: <?php echo $description; ?>">
	<meta name="keywords" content="Klettertouren: <?php while($routesData = $show_routes->fetch()) { echo $routesData['routesName'] . ' ' . $routesData['routesGrade'] . ', '; } ?>">

<?php } else { ?>

	<meta name="description" content="Klettern rund um München. Auf dieser Seite sollen die Klettergebiete um München vorgestellt werden.">
	<meta 
		name="keywords" 
		content="<?php 
			$online = $area->getAreasOnline(); 
			foreach ($online as $key) {
				$output .= $key['areaName'] . ', ';
			}
			$optimized = substr($output, 0, -2);
			echo 'Klettergebiete um München: ' . $optimized;
		?>
	">

<?php } ?>

<title>
	<?php

		if(isset($_GET['gebiet'])) {
			echo "Munichclimbs | ";

			$query = $pdo->prepare('SELECT area.name as areaName FROM area WHERE area.slug = :gebiet');
			$query->bindParam(':gebiet', $_GET['gebiet']);
			$query->execute();

        	while($layer = $query->fetch()) {
	      		if(isset($layer)) {
	        		echo $layer['areaName'];
	      		}
	    	}
		} elseif (isset($_GET["fels"])) {
			echo "Munichclimbs | ";
			
			$secondLayer  = get_params_without_topo($_GET["fels"]);
			$layerTwo     = $secondLayer->fetch();
			  if(isset($layerTwo)) {
				echo $layerTwo['areaName'] . " | " . $layerTwo['rockName'];
			  }
		} else {
			echo "Munichclimbs";
		}
	?>
</title>

<link rel="apple-touch-icon" sizes="57x57" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo BASE_URL; ?>images/favicon/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192"  href="<?php echo BASE_URL; ?>images/favicon/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo BASE_URL; ?>images/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="<?php echo BASE_URL; ?>images/favicon/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo BASE_URL; ?>images/favicon/favicon-16x16.png">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">

<link href='https://fonts.googleapis.com/css?family=Chelsea+Market' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
<link rel="stylesheet" href="node_modules/mdb-ui-kit/css/mdb.min.css" />
<link rel="stylesheet" href="node_modules/mdb-ui-kit/plugins/css/all.min.css" />

<style>
	@media (min-width: 1400px) {
		main,
		header,
		#main-navbar {
			padding-left: 240px;
		}
	}
</style>