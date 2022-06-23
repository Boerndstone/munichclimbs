<?php
	//require_once("../config/config.php");
	require_once(LOCAL_URL . "config/database.php");

	class Route extends Database {

		public $prozent;

		public function getRoutesData() {
			$sql = 'SELECT * FROM routes';	
			$query = $this->pdo->prepare($sql);
			$query->execute();

			while($routesData = $query->fetch()) {
				$dataRoutes[] = $routesData;
			}
			return $dataRoutes;
		}

		public function amountRoutesArea($areaId) {
			$sql = "SELECT routes.area_id FROM routes WHERE routes.area_id = :areaId";	
	      	$query = $this->pdo->prepare($sql);
	      	$query->bindParam(':areaId', $areaId);
	      	$query->execute();
	      	$routes = $query->rowCount();
	      	return $routes;
		}

		public function amountRoutesRock($rock_id_id) {
			$sql = "SELECT rock_id FROM routes WHERE rock_id = :rock_id_id";	
	      	$query = $this->pdo->prepare($sql);
	      	$query->bindParam(':rock_id_id', $rock_id_id);
	      	$query->execute();
	      	$routesAmount = $query->rowCount();
	      	return $routesAmount;
		}

		public function getGrade($areaId, $gradeLow, $gradeHigh) {
			$sql = "SELECT * FROM routes WHERE routes.area_id = :areaId AND routes.grade_no > :gradeLow AND routes.grade_no <= :gradeHigh";
			$query = $this->pdo->prepare($sql);
			$query->bindParam(':areaId', $areaId);
			$query->bindParam(':gradeLow', $gradeLow);
			$query->bindParam(':gradeHigh', $gradeHigh);
			$query->execute();
	        $routes = $query->rowCount();
			return $routes;
		}

		public function searchRoutes() {
			$sql = 'SELECT 
					routes.name as routeName
				FROM routes
				INNER JOIN rock ON routes.rock_id = rock.id
				WHERE rock.online = 1'
			;
	      	$query = $this->pdo->prepare($sql);
			$query->execute();
	        //$routes = $query->rowCount();
			return $query;
		}

		public function getGradeForRock($rock_id_id, $gradeLow, $gradeHigh) {
			$sql = "SELECT rock_id FROM routes WHERE rock_id = :rock_id_id AND routes.grade_no > :gradeLow AND routes.grade_no <= :gradeHigh";
			$query = $this->pdo->prepare($sql);
			$query->bindParam(':rock_id_id', $rock_id_id);
			$query->bindParam(':gradeLow', $gradeLow);
			$query->bindParam(':gradeHigh', $gradeHigh);
			$query->execute();
	        $routesGrade = $query->rowCount();
			return $routesGrade;
		}

		public function getProzent($areaId) {
			$prozent = 100/$this->amountRoutesArea($areaId);
			return $prozent;
		}

		public function getProzentForRock($routes_rocks_foreign_key) {
			$prozentRock = 100/$this->amountRoutesRock($routes_rocks_foreign_key);
			return $prozentRock;
		}

		public function getRoutesGrade($areaId, $min, $max) {
			$grades	= $this->getGrade($areaId, $min, $max);
			return $grades;
		}

		public function projects($areaId) {
			$sql 	= "SELECT * FROM routes WHERE routes.area_id = :areaId AND routes.grade_no IS NULL OR routes.grade_no = 0";
			$query 	= $this->pdo->prepare($sql);
			$query->bindParam(':areaId', $areaId);
	        $query->execute();
	        $projects = $query->rowCount();
			return $projects;
		}

		public function projectsRock($rock_id_id) {
			$sql 	= "SELECT rock_id FROM routes WHERE rock_id = :rock_id_id AND grade_no IS NULL";
			$query 	= $this->pdo->prepare($sql);
			$query->bindParam(':rock_id_id', $rock_id_id);
	        $query->execute();
	        $projectsRock = $query->rowCount();
			return $projectsRock;
		}

		public function routeProtection($protection) {

			$this->routeProtection = $protection;

			if($this->routeProtection == 3) {
				echo '<svg class="stroke-current inline-block text-red-600 h-5 w-5" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';			
			}  
		}

		public function routeBeauty($rating) {
			$this->routeBeauty = $rating;

			$star = '<svg class="fill-current inline-block text-yellow-600 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>';

			if($this->routeBeauty == -1) {
				echo '<i class="fas fa-trash-alt" data-title="Ziemlicher Schrott!" data-toggle="tooltip" data-placement="top"></i>';
			} elseif($this->routeBeauty == 1) {
				echo $star;
			} elseif($this->routeBeauty == 2) {
				echo str_repeat($star, 2 );
			} elseif($this->routeBeauty == 3) {
				echo str_repeat($star, 3 );
			}
		}
 	}

	$routes = new Route();
	$test = new Route();

?>