<?php 
header('Access-Control-Allow-Origin: *');
// para contrato con garantes
 if(!empty($_POST["nombre"])&&!empty($_POST["ci"])&&!empty($_POST["nombre1"])&&!empty($_POST["ci1"])&&!empty($_POST["nombre2"])&&!empty($_POST["ci2"])&&!empty($_POST["cel"])){ 
          require_once 'include/db_handler.php';  
		  $porcentaje=8.5;
		  $serie='CG'.date("ymdHis");
    				$db = new DbHandler();   
					$gestionn = $db->getdatenow(date("Y"),2); 
					$salida = $db->regcontrato($_POST["nombre"],$_POST["ci"],
											   $_POST["nombre1"],$_POST["ci1"],
											   $_POST["nombre2"],$_POST["ci2"],
											   $gestionn,2,$serie,$_POST["cel"]); 
					
					 $db->close();
		 if($salida==null)			 
        echo json_encode(array ('value'=>0));  
       else
 echo json_encode(array ('value'=>1,'data'=>$salida,'valor'=>$gestionn,'porcentaje'=> $porcentaje,'serie'=>$serie));  
    }else{ 
	  echo json_encode(array ('value'=>0));  	
	}
	 
?>