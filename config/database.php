<?php
	//Lokal
	$servername 	= "localhost";
	$username 		= "root";
	$password 		= "root";
	$db				= "munich";
	
	//Live
	/*$servername 	= "localhost";
	$username 		= "web24482296";
	$password 		= "vY1eBP4m";
	$db				= "usr_web24482296_2";*/

	// Create connection
	$conn = new mysqli($servername, $username, $password, $db);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	if (!$conn->set_charset("utf8")) {
		printf("Error loading character set utf8: %s\n", $conn->error);
	}

    // Create connection (Switch to PDO)
    try {
        $pdo = new PDO("mysql:host=$servername;dbname=$db;", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
    } catch(PDOException $e) {
        //echo 'ERROR!';
        //print_r( $e );
        die("Connection failed: " . $e->getMessage());
    }

    class Database {
    	public $pdo;

    	function __construct() {
    		global $pdo;
    		$this->pdo = $pdo;
    	}

    }
?>