<?php
 
class DbHandler {
 /*___________para saber los tipos de errores que emite mysql revisar: https://dev.mysql.com/doc/refman/5.5/en/error-messages-server.html*/

    function __construct() {
        require_once dirname(__FILE__) . '/db_connect_avancehost.php'; 
        $db = new DbConnect();
		$this->validatedb=$db;
        $this->conn = $db->connect();
    }
		 
	
	  public function close() {$conn=null;}
	   
	 
  
  public function getdatenow($gestion,$tipo) {
		 $stmt = $this->conn->prepare("update doc21 set valor=valor+1 where gestion=:g and tipo=:t"); 
		 $stmt->bindParam(':g', $gestion); 
		 $stmt->bindParam(':t', $tipo); 
		$result = $stmt->execute();
		$stmt->closeCursor(); 
		if($result){
			$stmt = $this->conn->prepare("SELECT * FROM doc21 where gestion=:g and tipo=:t");
			$stmt->bindParam(':g', $gestion); 
		    $stmt->bindParam(':t', $tipo);
			 if ($stmt->execute()) {
				$CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);
				if (count($CountReg) >= 1) { 
			 
					foreach ($CountReg as $row) { 
						$valor = $row['valor'];  
					}
					$stmt->closeCursor();  
					return $valor;
				}else{
					 
					$stmt->closeCursor();  
					return 0; 
				}
			} else { 
				$stmt->closeCursor();  
				return 0;
			}
		}else{
			 
			return -1;
		}
		 
		 
	 }
	 
	 public function regcontrato($nom,$ci,$nom1,$ci1,$nom2,$ci2,$numdoc,$tipo,$serie,$cel) {
	 
		 
			$stmt = $this->conn->prepare("INSERT INTO contratos21 (nom,ci,nom1,ci1,nom2,ci2,numdoc,tipo,serie,cel) VALUES (:a,:b,:c,:d,:e,:f,:g,:h,:i,:j)");
				$stmt->bindParam(':a', $nom, PDO::PARAM_STR, 12);
				$stmt->bindParam(':b', $ci); 
				$stmt->bindParam(':c', $nom1, PDO::PARAM_STR, 12);
				$stmt->bindParam(':d', $ci1); 
				$stmt->bindParam(':e', $nom2, PDO::PARAM_STR, 12);
				$stmt->bindParam(':f', $ci2); 
				$stmt->bindParam(':g', $numdoc); 
				$stmt->bindParam(':h', $tipo);
				$stmt->bindParam(':i', $serie, PDO::PARAM_STR, 12);
				$stmt->bindParam(':j', $cel);
			 $result = $stmt->execute(); 
			 $stmt->closeCursor();
			 return $result;
		 
	 }
	 
  
}

?>
