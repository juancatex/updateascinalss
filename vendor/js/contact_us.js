window.usermain =null;
window.dbfi = firebase.firestore();
function sendsms(){
    $.fancybox.close(true); 
    const phoneNumber = '+591'+($("#numcel").val()).replace('-', ''); 
    const appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => { 
          window.confirmationResult = confirmationResult;   
          $.fancybox.open({
            src  : '#getcode',
            type : 'inline',
            opts : {
                animationDuration : 500 
            }
        });
        }).catch((error) => {
           grecaptcha.reset(window.recaptchaWidgetId);
          console.log('error:',error);
          $.fancybox.close(true);
          if(error.code=='auth/too-many-requests'){
            
            output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Excedio la cantidad maxima de peticiones, intentelo mas tarde porfavor.</div>';
            $("#result").hide().html(output).slideDown();
            $(".contact_btn i").addClass('d-none');   
            $(".contact_btn b").text('Validar');
          }else{
            output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">'+error.code+'<br>'+error.message+'.</div>';
            $("#result").hide().html(output).slideDown();
            $(".contact_btn i").addClass('d-none');   
            $(".contact_btn b").text('Validar');
          }
        });
    }
   
   

 function validatedata() { 
    $(".contact_btn").attr("disabled", "disabled");
    $(".contact_btn b").text('Validando');
    $(".contact_btn i").removeClass('d-none');
 
    var output;
    var proceed = true; 
    var errormensaje = 'Ingrese datos para validar.';
 
    $('#contact-form-data input').each(function() {
        proceed = proceed?$(this).val().length != 0:false;
        
        
         if(proceed===false){ 
           switch($(this).attr('name')){
                case 'ci': 
                case 'name':  
                errormensaje='Debe ingresar un carnet de indetidad válido.';break;
                case 'cel':  
                errormensaje='Debe ingresar su numero de celular.';break; 
            }
            return false;
        }else if($(this).attr('name')=='cel'){  
            proceed=($(this).val().replace(/\_/g, '').replace(/\-/g, '')).length==8;
            errormensaje='El número de celular es incorrecto.'; 
        }
    });
 
    if (proceed) {
        $( "#sign-in-button" ).prop( "disabled", true );
        $("#sign-in-button").attr("disabled", "disabled");
        sendsms(); 
    }
    else
    {
        grecaptcha.reset(window.recaptchaWidgetId); 
        output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">'+errormensaje+'</div>';
        $("#result").hide().html(output).slideDown();
        $(".contact_btn i").addClass('d-none');    
        $(".contact_btn b").text('Validar');
    }


};
function outsession(){
    $.fancybox.close(true); 
    $.fancybox.open({
        src  : '#mensajeok',
        type : 'inline',
        opts : {
            animationDuration : 500 
        }
    });
            setTimeout(() => {
                firebase.auth().signOut().then(() => {
                    location.reload();
                }).catch((error) => {
                    location.reload();
                });
            }, 3000); 
 }

$("#modal-contact-form-data").submit(function(e){ 
    e.preventDefault();  
    $(".modal_contact_btn i").removeClass('d-none');
    $(".modal_contact_btn" ).prop( "disabled", true );  
    $(".modal_contact_btn b").text('Actualizando');

    var output;
    var proceed = "true"; 
    $('#modal-contact-form-data input').each(function() {
        if(!$(this).val()){
            proceed = "false";
        }
    });
    if (proceed === "true") {
        $('#modal-contact-form-data input').each(function() { 
            $(this).prop( "disabled", true ); 
        });
        $('#modal-contact-form-data select').each(function() { 
            $(this).prop( "disabled", true ); 
        });
        $('#modal-contact-form-data textarea').each(function() { 
            $(this).prop( "disabled", true ); 
        });

        dbfi.collection("socio").doc(window.usermain.numpapeleta).set({
            iud: window.usermain.iud,
            nombre: $('#namecontac').val().toUpperCase(),
            amaterno: $('#apcontac').val().toUpperCase(),
            apaterno: $('#amcontac').val().toUpperCase(),
            fecnac: $('#naccontac').val(),
            ci: $('#cicontac').val(),
            expedido: $('#extcontac').children("option:selected").val(),
            estadocivil: $('#civilcontac').children("option:selected").val(),
            dir: $('#dircontac').val(), 
            papeleta: window.usermain.numpapeleta,
            carmilitar: $('#cmcontac').val(),
            grado: $('#gradocontac').val().toUpperCase(),
            destino: $('#destinocontac').val().toUpperCase(),
            tel: $('#telcontac').val().replace(/\_/g, '').replace(/\-/g, ''),
            cel: $('#celcontac').val().replace(/\_/g, '').replace(/\-/g, ''),
            email: $('#emailcontac').val()
        })
        .then((docRef) => { 
            outsession();
        })
        .catch((error) => {
            outsession();
        });


    }
    else {
         output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Debe introducir todos los datos solicitados.</div>';
            $("#quote_result_contact").hide().html(output).slideDown();
            $(".modal_contact_btn i").addClass('d-none'); 
            $(".modal_contact_btn b").text('Actualizar Datos');
		 
    }
});

$("#modal-contact-getcode").submit(function(e){ 
    e.preventDefault();  
     
    $(".modal_validate_code i").removeClass('d-none'); 
    $("#quote_result_code").html('');
    $(".modal_validate_code b").text('Validando código ingresado');
    $( ".modal_validate_code" ).prop( "disabled", true ); 
    var output;
    var proceed = "true";  
    $('#modal-contact-getcode input').each(function() {
        if(!$(this).val()){
            proceed = "false";
        }
    });
 
    if (proceed === "true") {
        $( "#sign-in-button" ).prop( "disabled", true ); 
        $("#grupobuttonn").addClass('d-none');  
        $( "#codein" ).prop( "disabled", true ); 
        window.confirmationResult.confirm($("#codein").val()).then((result) => {
                window.usermain.telcelular=$('#numcel').val().replace(/\_/g, '').replace(/\-/g, '');
                window.usermain.iud=result.user.uid;
                $("#numcontac").val(window.usermain.numpapeleta?window.usermain.numpapeleta:'');
                _.forEach(window.usermain.des, function(value) { 
                    document.querySelector('#listdestino').innerHTML+="<option value='" + value.nomdestino + "'>" + value.nomdestino +"     Cod.:"+ value.coddestino +"</option>";
                }); 
            dbfi.collection("socio").doc(window.usermain.numpapeleta).get().then((doc) => {
                $.fancybox.close(true);  
                if (doc.exists) {  
                        $("#destinocontac").val(doc.data().destino);
                        $("#namecontac").val(doc.data().nombre);
                        $("#apcontac").val(doc.data().apaterno);
                        $("#amcontac").val(doc.data().amaterno);
                        $("#naccontac").val(doc.data().fecnac);
                        $("#cicontac").val(doc.data().ci);
                        $('#extcontac option[value='+(doc.data().expedido)+']').attr('selected','selected');
                        $('#civilcontac option[value='+(doc.data().estadocivil)+']').attr('selected','selected');
                        $("#dircontac").val(doc.data().dir); 
                        $("#cmcontac").val(doc.data().carmilitar);
                        $("#gradocontac").val(doc.data().grado);   
                        $("#telcontac").val(doc.data().tel); 
                        $("#celcontac").val(doc.data().cel); 
                        $("#emailcontac").val(doc.data().email);

                } else { 
                        $("#namecontac").val(window.usermain.nombre?window.usermain.nombre:'');
                        $("#apcontac").val(window.usermain.apaterno?window.usermain.apaterno:'');
                        $("#amcontac").val(window.usermain.amaterno?window.usermain.amaterno:'');
                        $("#naccontac").val(window.usermain.fechanacimiento?window.usermain.fechanacimiento:'');
                        $("#cicontac").val(window.usermain.ci?window.usermain.ci:'');
                        $('#extcontac option[value='+(window.usermain.iddepartamentoexpedido?window.usermain.iddepartamentoexpedido:1)+']').attr('selected','selected');
                        $('#civilcontac option[value='+(window.usermain.idestadocivil?window.usermain.idestadocivil:1)+']').attr('selected','selected');
                        $("#numcontac").val(window.usermain.numpapeleta?window.usermain.numpapeleta:'');
                        $("#cmcontac").val(window.usermain.carnetmilitar?window.usermain.carnetmilitar:'');
                        $("#gradocontac").val(window.usermain.nomgrado?window.usermain.nomgrado:'');  
                        var destino=_.find(window.usermain.des, function(o) { return o.iddestino === window.usermain.iddestino; });
                        $("#destinocontac").val(destino.nomdestino);
                        $("#telcontac").val(window.usermain.telfijo?window.usermain.telfijo:''); 
                        $("#celcontac").val(window.usermain.telcelular?window.usermain.telcelular:''); 
                        $("#emailcontac").val(window.usermain.email?window.usermain.email:''); 
                }
                setTimeout(function(){$.fancybox.open({
                    src  : '#animatedModal',
                    type : 'inline',
                    opts : {
                        animationDuration : 500 
                    }
                }); }, 1000);
            }).catch((error) => {
                console.log("Error getting document:", error);
            }); 
        }).catch((error) => {
            $( "#codein" ).prop( "disabled", false );
            output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">El código ingresado no es el correcto.</div>';
            $("#quote_result_code").hide().html(output).slideDown();
            $(".modal_validate_code i").addClass('d-none');   
            $(".modal_validate_code b").text('Validar código');
           
          });
    }
    else {
         
            output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Debe ingresar el codigo enviado.</div>';
            $("#quote_result_code").hide().html(output).slideDown();
            $(".modal_validate_code i").addClass('d-none');  
            $(".modal_validate_code b").text('Validar código');
    }

});
 
 
$("#contact-form-data").submit(function(e){ 
    e.preventDefault();   
});
 
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
    'size': 'invisible',
    'callback': function(response) {
        validatedata(); 
    }
  });

  recaptchaVerifier.render().then(function(widgetId) {
    window.recaptchaWidgetId = widgetId;  
  });

var buscador= _.debounce(function(word,fun){
    $.post('servidor/getsocioupdate.php', {busca:word}, function(res){
       fun(res); 
    });
}, 350, false);
$("#inputcard2").keyup(function(){ 
    document.querySelector('#listgarante2').innerHTML='';
    document.querySelector('#error2').innerHTML=''; 
    if(this.value.length>0){
        window.usermain=null;
        buscador(this.value,function(res){ 
          var user=JSON.parse(res);  
          document.querySelector('#error2').innerHTML=''; 
          document.querySelector('#listgarante2').innerHTML='';
          document.getElementById('inputname').value=''; 
          if(user.value>0){ 
              if(user.data.length==1){  
                   document.getElementById('inputcard2').value=user.data[0].ci;
                   document.getElementById('inputname').value=user.data[0].nombre  +" "+ user.data[0].apaterno +" "+ user.data[0].amaterno;
                   window.usermain=user.data[0];  
                   window.usermain.des= _.reduce(user.des, function(result, value) {
                        if(value.idfuerza==window.usermain.idfuerza) { 
                            if(_.isArray(result)){
                                result.push(value);
                            }else{
                                result = [];
                                result.push(value);
                            }
                        } 
                    return result;
                  }, []);
                //   console.log(window.usermain);

                   $( "#numcel" ).focus();
              }else{   
                  _.forEach(user.data, function(value) { 
                    document.querySelector('#listgarante2').innerHTML+="<option value='" + value.ci + "'>" + value.nombre +" "+ value.apaterno +" "+ value.amaterno +"</option>";
                  });
              }	
          }else{ 
              document.querySelector('#error2').innerHTML='El socio no se encuentra registrado.';
           } 
      });
    } 
  }); 