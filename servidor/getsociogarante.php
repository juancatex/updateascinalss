<?php 
header('Access-Control-Allow-Origin: *');
 if(!empty($_GET["ci"])){ 
   require_once 'include/db_handler_apk.php';  
    				$db = new DbHandler();   
					$salida = $db->getsociogarante($_GET["ci"]); 
					 $db->close();
		 if($salida==null)			 
        echo json_encode(array ('value'=>0));  
       else
	    echo json_encode(array ('value'=>1,'data'=>$salida));  
    }else{ 
	  echo json_encode(array ('value'=>0));  	
	}
	 
?>