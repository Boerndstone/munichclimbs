<?php
	//require_once("../config/config.php");
	require_once(LOCAL_URL . "config/database.php");

	class Rocks extends Database {
		
		public $titleRock;
		public $childFriendly;
		public $rain_protection;
		public $sunny;
		public $rocks_sunny;

		public function getIdRocks($titleRock) {
	      $sql = 'SELECT rock.name as rockName FROM rock WHERE rock.name = :titleRock';
	      $query = $this->pdo->prepare($sql);
	      $query->bindParam(':titleRock', $titleRock);
	      $query->execute();
	      return $query;
	    } 

	    public function getGeoCoordinates($titleRock) {
	      $sql = 'SELECT rocks_lat, rocks_lng FROM rocks WHERE rocks_name = :titleRock';
	      $query = $this->pdo->prepare($sql);
	      $query->bindParam(':titleRock', $titleRock);
	      $query->execute();
	      return $query;
	    } 

		public function getRock($routeName) {
			$sql = 'SELECT
				  rock.name as rockName,
				  rock.slug as rockSlug
			  	FROM rock 
			  	INNER JOIN routes ON rock.id =  routes.rock_id
				WHERE routes.name = :routeName 
				LIMIT 1'
		  ;
			$query = $this->pdo->prepare($sql);
			$query->bindParam(':routeName', $routeName);
			$query->execute();
			return $query;
	  }

		public function get_title_of_rock($titleRock) {
	      	$sql = 'SELECT
					rock.id as rockId,
					rock.name as rockName,
					rock.description as rockDescription,
					rock.access as rockAccess,
					rock.nature as rockNature,
					rock.zone as rockZone,
					rock.banned as rockBanned,
					rock.height as rockHeight,
					rock.orientation as rockOrientation,
					rock.season as rockSeason,
					rock.child_friendly as rockchildFriendly,
					rock.sunny as rockSunny,
					rock.rain as rockRainProtection,
					rock.area_id as rockAreaId,
					rock.nr as rockNr,
					rock.image as rockImage,
					area.name as areaName,
					area.slug as areaUrl,
					rock.lat as rocksLat,
					rock.lng as rocksLng,
					routes.rock_id as routesIdId,
					routes.name as routesName,
					routes.topo_id as routesTopoId
					  
				FROM routes 
			  	INNER JOIN rock ON routes.rock_id = rock.id 
			  	INNER JOIN area ON routes.area_id = area.id 
			  	WHERE rock.slug = :titleRock 
			  	LIMIT 1'
			;
	      	$query = $this->pdo->prepare($sql);
	      	$query->bindParam(':titleRock', $titleRock);
	      	$query->execute();
	      	return $query;
	    }

	    public function showRoutesRock($rocks_name) {
	      	$sql = 'SELECT 
			  			routes.name as routesName, 
						routes.grade as routesGrade 
						FROM rock 
						INNER JOIN routes ON rock.id = routes.rock_id 
						WHERE rock.slug = :rocks_name 
						ORDER BY routes.nr'
			;
	      	$query = $this->pdo->prepare($sql);
	      	$query->bindParam(':rocks_name', $rocks_name);
	      	$query->execute();
	      	return $query;
	    }

		public function amountRocks($amount_rocks) {
			$sql = 'SELECT * FROM area INNER JOIN rock ON area.id = rock.area_id WHERE area_id = :amountRocks';
			$query = $this->pdo->prepare($sql);
			$query->bindParam(':amountRocks', $amount_rocks);
			$query->execute();
			$rocks = $query->rowCount();
			return $rocks;
		}

		public function getImageForRock($gebiet, $fels) {
			$sql = 'SELECT * FROM galerie WHERE galerie_belongs_to_area = :gebiet AND galerie_belongs_to_rocks = :fels ';
			$query = $this->pdo->prepare($sql);
			$query->bindParam(':gebiet', $gebiet);
			$query->bindParam(':fels', $fels);
			$query->execute();
	      	return $query;
	    }

	    public function getHeaderimageForRock($fels) {
			$sql = 'SELECT header_image, slug FROM rock WHERE  slug = :fels ';
			$query = $this->pdo->prepare($sql);
			$query->bindParam(':fels', $fels);
			$query->execute();
	      	return $query;
	    }

		public function height($rocks_height) {
			return $rocks_height;
		}

		public function childFriendly($rocksChildFriendly) {
			$this->childFriendly = $rocksChildFriendly;

			if($this->childFriendly == 2) {
				echo 'transform: rotate(45deg);';
			} elseif($this->childFriendly == 3) {
				echo 'transform: rotate(90deg);';
			} 
		}

		public function rainProtected($rocks_rain_protection) {

			$this->rain_protection = $rocks_rain_protection;

			if($this->rain_protection < 2) {
				echo '<svg class="stroke-current inline-block text-green-900 mb-1 h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>';
			} else {
				echo '<svg class="stroke-current inline-block text-red-700 mb-1 h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path></svg>';
			} 

		}

		public function sunny($rocks_sunny) {

			$this->sunny = $rocks_sunny;

			if($this->sunny >= 1) {
				echo '<svg class="stroke-current inline-block text-yellow-700 h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>';
			} else {
				echo '<svg class="stroke-current inline-block text-red-700 h-5 w-5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>';
			}

		}

		public function sunnyAllgemein($rocks_sunny_general) {

			$this->sunnyGeneral = $rocks_sunny_general;

			if($this->sunnyGeneral == 1) {
				echo 'keine Sonne';
			} elseif($this->sunnyGeneral == 2) {
				echo 'teils Sonne';
			} else {
				echo 'sonnig';
			}

		}

		public function childFriendlyAllgemein($rocks_child_general) {

			$this->childGeneral = $rocks_child_general;

			if($this->childGeneral == 1) {
				echo 'gut geeignet';
			} elseif($this->sunnyGeneral == 2) {
				echo 'nur teils geeignet';
			} elseif($this->sunnyGeneral == 3) {
				echo 'ungeeignet';
			} else {
				echo 'keine Angaben';
			}

		}

		public function rainProtectedAllgemein($rocks_rain_protection_general) {

			$this->rainGeneral = $rocks_rain_protection_general;

			if($this->rainGeneral == 1) {
				echo 'regensicher';
			} elseif($this->rainGeneral == 2) {
				echo 'kaum regensicher';
			} elseif($this->rainGeneral == 3) {
				echo 'nicht regensicher';
			} 

		}
									
	}

	$rocks = new Rocks();

?>