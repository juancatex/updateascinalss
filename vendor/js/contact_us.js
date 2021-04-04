window.usermain =null;
function sendsms(){
    $.fancybox.close(true);
    // const phoneNumber = '+59177549539';
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
   
   

$(".contact_btn").on('click', function () {
    //disable submit button on click 
    $(".contact_btn").attr("disabled", "disabled");
    $(".contact_btn b").text('Validando');
    $(".contact_btn i").removeClass('d-none');

    //simple validation at client's end
    var post_data, output;
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

    //everything looks good! proceed...
    if (proceed) {
         
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': function(response) {
              sendsms();
            },
            'expired-callback': function() {
                console.log("expired-callback");
                window.recaptchaVerifier.reset();
            } 
             
        }); 
        recaptchaVerifier.render().then(function(widgetId) {
            window.recaptchaWidgetId = widgetId;
            grecaptcha.reset(window.recaptchaWidgetId); 
            $.fancybox.open({
                src  : '#capcha',
                type : 'inline',
                opts : {
                    animationDuration : 500 
                }
            }); 
        });

    }
    else
    {
        output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">'+errormensaje+'</div>';
        $("#result").hide().html(output).slideDown();
        $(".contact_btn i").addClass('d-none');    
        $(".contact_btn b").text('Validar');
    }


});



//modal window form

$(".modal_contact_btn").on('click', function () {
    //disable submit button on click
    // $(".modal_contact_btn").attr("disabled", "disabled");
    // $(".modal_contact_btn b").text('Sending');
    $(".modal_contact_btn i").removeClass('d-none');

    //simple validation at client's end
    var post_data, output;
    var proceed = "true";

    var str=$('#modal-contact-form-data').serializeArray();

    $('#modal-contact-form-data input').each(function() {
        if(!$(this).val()){
            proceed = "false";
        }
    });

    //everything looks good! proceed...
    if (proceed === "true") {

        
        var pathArray = window.location.pathname.split('/');
        var secondLevelLocation = pathArray[3];

        var accessURL;
        if(secondLevelLocation){
            accessURL="../vendor/contact-mailer.php";
        }else{
            accessURL="vendor/contact-mailer.php";
        }
        //data to be sent to server
        $.ajax({
            type : 'POST',
            // url : 'vendor/contact-mailer.php',
            url : accessURL,
            data : str,
            dataType: 'json',
            success: function(response) {
                if (response.type == 'error') {
                    output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">' + response.text + '</div>';
                } else {
                    output = '<div class="alert-success" style="padding:10px 15px; margin-bottom:30px;">' + response.text + '</div>';
                    //reset values in all input fields
                    $('.contact-form input').val('');
                    $('.contact-form textarea').val('');
                }


                if ($("#quote_result").length) {
                    $("#quote_result").hide().html(output).slideDown();
                    $(".modal_contact_btn i").addClass('d-none');
                }else{
                    if (response.type == 'error') {
                        Swal.fire({
                            type: 'error',
                            icon: 'error',
                            title: 'Oops...',
                            html: '<div class="text-danger">'+ response.text +'</div>',
                        })
                        $(".modal_contact_btn i").addClass('d-none');
                    }else{
                        Swal.fire({
                            type: 'success',
                            icon: 'success',
                            title: 'Success!',
                            html: '<div class="text-success">'+ response.text +'</div>',
                        })
                        $(".modal_contact_btn i").addClass('d-none');
                    }
                }
                // $("#quote_result").hide().html(output).slideDown();
                // $(".modal_contact_btn i").addClass('d-none');
            },
            error: function () {
                alert("Failer");
            }
        });

    }
    else {
        // output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Please provide the missing fields.</div>';
        // $("#quote_result").hide().html(output).slideDown();
        // $(".modal_contact_btn i").addClass('d-none');
        // if ($("#quote_result").length) {
            // alert("yes");
            output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Debe todos los datos solicitados.</div>';
            $("#quote_result").hide().html(output).slideDown();
            $(".modal_contact_btn i").addClass('d-none');
        // }else{
            // Swal.fire({
                // icon: 'error',
                // type: 'error',
                // title: 'Oops...',
                // html: '<div class="text-danger">Please provide the missing fields.</div>'
            // })
            // $(".modal_contact_btn i").addClass('d-none');
        // }
		$.fancybox.close(true);
    }

});

$(".modal_validate_code").on('click', function (){ 
    $(".modal_validate_code i").removeClass('d-none'); 
    $("#quote_result_code").html('');
    $(".modal_validate_code b").text('Validando código ingresado');
    var post_data, output;
    var proceed = "true";  
    $('#modal-contact-getcode input').each(function() {
        if(!$(this).val()){
            proceed = "false";
        }
    });
 
    if (proceed === "true") {
        $(".modal_validate_code").addClass('d-none');
        $( "#codein" ).prop( "disabled", true ); 
        window.confirmationResult.confirm($("#codein").val()).then((result) => { 
            window.usermain.telcelular=$('#numcel').val().replace(/\_/g, '').replace(/\-/g, '');
            window.usermain.iud=result.user.uid;  
        }).catch((error) => {
            $( "#codein" ).prop( "disabled", false );
            output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">El código ingresado no es el correcto.</div>';
            $("#quote_result_code").hide().html(output).slideDown();
            $(".modal_validate_code i").addClass('d-none');   
            $(".modal_validate_code").removeClass('d-none');
            $(".modal_validate_code b").text('Validar código');
           
          });
    }
    else {
         
            output = '<div class="alert-danger" style="padding:10px 15px; margin-bottom:30px;">Debe ingresar el codigo enviado.</div>';
            $("#quote_result_code").hide().html(output).slideDown();
            $(".modal_validate_code i").addClass('d-none'); 
            $(".modal_validate_code").removeClass('d-none');
            $(".modal_validate_code b").text('Validar código');
    }

});

$("#modal-contact-getcode").submit(function(e){ 
    e.preventDefault();  
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
                   document.getElementById('inputname').value=user.data[0].nombre;
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
                  console.log(window.usermain);

                   $( "#numcel" ).focus();
              }else{   
                  _.forEach(user.data, function(value) { 
                    document.querySelector('#listgarante2').innerHTML+="<option value='" + value.ci + "'>" + value.nombre + "</option>";
                  });
              }	
          }else{ 
              document.querySelector('#error2').innerHTML='El socio no se encuentra registrado.';
           } 
      });
    } 
  });
// SPuEco68M7hPk95UzfgzViZBgHP2k
// SPuEco68M7hPk95UzfgzViZBgHP2