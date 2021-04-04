<?php
 
class DbConnect {

    
    function __construct() {
        
    } 
    function connect() {
        include_once dirname(__FILE__) . '/config.php';
        try {
            $this->conn = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USERNAME, DB_PASSWORD);
            $this->conn->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
            $this->conn->exec("set names utf8mb4");
        } catch (PDOException $e) {
            echo "  <p>Error: " . $e->getMessage() . "</p>\n";
            exit();
        } 
        return $this->conn;
    }
	 

} 
