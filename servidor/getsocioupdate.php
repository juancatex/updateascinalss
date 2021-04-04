<?php 
header('Access-Control-Allow-Origin: *');
 if(!empty($_POST["busca"])){ 
   require_once 'include/db_handler_apk.php';  
    				$db = new DbHandler();   
					$salida = $db->getsocioupdate($_POST["busca"]); 
					$des = $db->getdestino(); 
					 $db->close();
		 if($salida==null)			 
        echo json_encode(array ('value'=>0));  
       else
	    echo json_encode(array ('value'=>1,'data'=>$salida,'des'=>$des));  
    }else{ 
	  echo json_encode(array ('value'=>0));  	
	}
	 
?>