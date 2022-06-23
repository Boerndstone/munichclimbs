<?php
	//require_once("../config/config.php");
	require_once(LOCAL_URL . "config/database.php");

	class Areas extends Database {
		
		public function getAreasOnline() {
			$sql = 'SELECT area.id as areaId, area.name as areaName, area.slug as areaSlug, area.image as areaImage FROM area WHERE online = 1 ORDER BY sequence';	
			$query = $this->pdo->prepare($sql);
			$query->execute();

			while($areaData = $query->fetch()) {
				$dataArea[] = $areaData;
			}
			return $dataArea;
		}

		public function showRocksArea($areaName) {
	      	$sql = 'SELECT 
					area.name as areaName, 
					area.slug as areaSlug, 
					rock.id as rockId, 
					rock.name as rockName, 
					rock.slug as rockSlug, 
					rock.height as rockHeight,
					rock.child_friendly as rockChildFriendly,
					rock.banned as rockBanned, 
					rock.sunny as rockSunny,
					rock.image as rockImage,
					rock.rain as rockRain, 
					rock.lat as rockLat, 
					rock.lng as rockLng, 
					rock.orientation as rockOrientation 
				FROM area 
				INNER JOIN rock ON area.id = rock.area_id 
				WHERE 
					area.slug = :areaName 
					and rock.online = 1 
				ORDER BY rock.nr';
	      	$query = $this->pdo->prepare($sql);
	      	$query->bindParam(':areaName', $areaName);
	      	$query->execute();
			return $query;
	    }

	    public function getTitleAreaNameViaParams($get_page) {
			$sql = 'SELECT 
				area.name as areaName, 
				area.slug as areaSlug 
				FROM area 
				WHERE area.slug = :get_page'
			;
	     	$query = $this->pdo->prepare($sql);
	     	$query->bindParam(':get_page', $get_page);
	     	$query->execute();
	     	return $query;
		}

		public function getHeaderimageForArea($gebiet) {
			$sql = 'SELECT area.name as areaName, area.header_image as areaHeaderImage, area.slug as areaSlug FROM area WHERE  area.slug = :gebiet ';
			$query = $this->pdo->prepare($sql);
			$query->bindParam(':gebiet', $gebiet);
			$query->execute();
	      	return $query;
	    }
		
	}

	$area = new Areas();

?>