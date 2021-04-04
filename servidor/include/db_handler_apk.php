<?php
 
class DbHandler {
 /*___________para saber los tipos de errores que emite mysql revisar: https://dev.mysql.com/doc/refman/5.5/en/error-messages-server.html*/

    function __construct() {
        require_once dirname(__FILE__) . '/db_connect_avancehost2.php'; 
        $db = new DbConnect();
        $this->validatedb=$db;
        $this->conn = $db->connect();
    }
    	 
	
	  public function close() {$conn=null;}
	  
	   
	 public function getstatussocio($num) {
		   
		$stmt = $this->conn->prepare("SELECT concat(UPPER(TRIM(so.nombre)),' ',UPPER(TRIM(so.apaterno)),' ',UPPER(TRIM(so.amaterno))) as nombre,concat(ci,' ',dep.abrvdep) as cedula 
		FROM socios so, par_departamentos dep
		WHERE  so.iddepartamentoexpedido = dep.iddepartamento and so.ci=:t");			 
		$stmt->bindParam(':t', $num);
	      if ($stmt->execute()) {
            $CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if (count($CountReg) >= 1) {
				$userid = array(); 
				foreach ($CountReg as $row) {
					$userid["nombre"] = $row["nombre"];   
					$userid["ci"] = $row["cedula"];    
				} 
				$stmt->closeCursor();  
				return $userid;
		    }else{
				$stmt->closeCursor();  
                return null; 
			}
        } else { 
			$stmt->closeCursor();  
            return null;
        } 
	 }
	 public function getsociogarante($num) {
		   
		$stmt = $this->conn->prepare("SELECT concat(UPPER(TRIM(so.nombre)),' ',UPPER(TRIM(so.apaterno)),' ',UPPER(TRIM(so.amaterno))) as nombre,concat(ci,' ',dep.abrvdep) as ci 
		FROM socios so, par_departamentos dep
		WHERE  so.iddepartamentoexpedido = dep.iddepartamento and concat(ci,' ',dep.abrvdep) like '$num%' limit 10"); 
	      if ($stmt->execute()) {
            $CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if (count($CountReg) >= 1) { 
				$stmt->closeCursor();  
				return $CountReg;
		    }else{
				$stmt->closeCursor();  
                return null; 
			}
        } else { 
			$stmt->closeCursor();  
            return null;
        } 
	 }
	 public function getsocioupdate($dataa) {
		   
		$stmt = $this->conn->prepare("SELECT so.numpapeleta,so.nombre,so.apaterno,so.amaterno, ci,so.iddepartamentoexpedido,so.iddestino,so.telfijo,f.idfuerza,f.nomfuerza,
		so.telcelular,so.email,so.direcciondomicilio,so.carnetmilitar,so.fechanacimiento,so.idestadocivil,g.nomgrado,g.abrev as gradoabr
		FROM socios so, par_grados g, par_fuerzas f
		WHERE  
        so.idfuerza=f.idfuerza and
        so.idgrado=g.idgrado AND
		 (so.ci like '$dataa%'  
                or so.numpapeleta like '%$dataa%') limit 10"); 
	      if ($stmt->execute()) {
            $CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if (count($CountReg) >= 1) { 
				$stmt->closeCursor();  
				return $CountReg;
		    }else{
				$stmt->closeCursor();  
                return null; 
			}
        } else { 
			$stmt->closeCursor();  
            return null;
        } 
	 }
	 public function getdestino() {
		   
		$stmt = $this->conn->prepare("SELECT iddestino,idfuerza,coddestino,nomdestino FROM par__destinos where activo=1"); 
	      if ($stmt->execute()) {
            $CountReg = $stmt->fetchAll(PDO::FETCH_ASSOC);
			if (count($CountReg) >= 1) { 
				$stmt->closeCursor();  
				return $CountReg;
		    }else{
				$stmt->closeCursor();  
                return null; 
			}
        } else { 
			$stmt->closeCursor();  
            return null;
        } 
	 }
}

?>
