<?php
	
	require_once(LOCAL_URL . "config/database.php");
	
	function getGradeDetail($routes_rocks_foreign_key, $gradeLow, $gradeHigh) {
		global $pdo;
		$query = $pdo->prepare('SELECT * FROM routes WHERE routes_rocks_foreign_key = :routes_rocks_foreign_key AND routes_grade_no > :gradeLow AND routes_grade_no <= :gradeHigh');
		$query->bindParam(':routes_rocks_foreign_key', $routes_rocks_foreign_key);
		$query->bindParam(':gradeLow', $gradeLow);
		$query->bindParam(':gradeHigh', $gradeHigh);
		$query->execute();
		$routes = $query->rowCount();
		return $routes;
	}
	
	function get_params_without_topo($valueFelsname) {
		global $pdo;
		$sql = 'SELECT 
				area.name as areaName,
				rock.name as rockName 
				FROM area 
				INNER JOIN rock ON area.id = rock.area_id 
				INNER JOIN routes ON rock.id = routes.rock_id 
				WHERE rock.slug = :valueFelsname 
				AND rock.id = routes.rock_id
				ORDER BY routes.nr';
		$query = $pdo->prepare($sql);
		$query->bindParam(':valueFelsname', $valueFelsname);
		$query->execute();
      	return $query;
	}


	function getParamsWithTopo($felsname, $value) {
		global $pdo;
		$sql = 'SELECT  
				area.name as areaName,
				area.id as areaId,
				area.slug as areaSlug,
				rock.area_id as rockAreaId,
				routes.id as routesId,
				rock.id as rockId,
				rock.nr as rockNr,
				routes.nr as routesNr,
				routes.name as routesName,
				routes.grade as routesGrade,
				routes.first_ascent as routesFirstAscent,
				routes.year_first_ascent as routesYearFirstAscent,
				routes.protection as routesProtection,
				routes.description as routesDescription,
				routes.rating as routesRating,
				topo.with_sector as topoWithSector,
				topo.name as topoName,
				topo.image as topoImage,
				topo.svg as topoSVG
				FROM area 
				INNER JOIN rock ON area.id = rock.area_id 
				INNER JOIN routes ON rock.id = routes.rock_id 
				INNER JOIN topo ON routes.topo_id = topo.number 
				WHERE rock.name = :felsname 
				AND routes.rock_id = topo.rocks_id 
				AND routes.topo_id = topo.number 
				AND routes.topo_id = :value 
				ORDER BY routes.nr';
		$query = $pdo->prepare($sql);
		$query->bindParam(':felsname', $felsname);
		$query->bindParam(':value', $value);
		$query->execute();
		return $query;
	}
	
	
	function get_params($valueFelsname, $valueTopoRoute) {
		global $pdo;
		$query = $pdo->prepare('SELECT * FROM areas INNER JOIN rocks ON areas.area_id = rocks.area_id INNER JOIN routes ON rocks.id = routes.routes_rocks_foreign_key INNER JOIN topos ON routes.routes_rocks_foreign_key = topos.topos_rocks_foreign_key WHERE rocks.rocks_name = :valueFelsname AND routes.routes_topos_id = topos.topos_routes_id AND routes.routes_topos_id = :valueTopoRoute ORDER BY routes.routes_nr');
		$query->bindParam(':valueFelsname', $valueFelsname);
		$query->bindParam(':valueTopoRoute', $valueTopoRoute);
      	$query->execute();
		return $query;
	}

?>