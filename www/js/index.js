//phonegap remote login -u mauricio.bedoya@gmail.com -p mauricio12
//phonegap local plugin add https://github.com/phonegap-build/BarcodeScanner.git
//phonegap plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-inappbrowser.git
//phonegap local plugin add org.apache.cordova.geolocation

var user = { firstName: '', lastName: '', fullName: '', email: '' }
var qrCodeText = "Evento_CentroComercialTesoro";
var currentPosition = null;
var currentAddress = null;

function initialize(){

    openFB.init('854392904574269'); // Defaults to sessionStorage for storing the Facebook token

//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
//  openFB.init('YOUR_FB_APP_ID', 'http://localhost/openfb/oauthcallback.html', window.localStorage);
}

//Document Ready
$(document).ready(function (){

    initialize();

    $( document ).on( "pageinit", "#page-welcome", function() {

        $("#fullname").html(user.fullName);
    });

    $("#getCodeButton").on("click", function(){

        try{

            cordova.plugins.barcodeScanner.scan(
                function (result) {

                    if(!result.cancelled){

                        if(result.format.toLowerCase() == "qr_code"){

                            if(result.text == qrCodeText){

                                $.mobile.changePage("#page-firstclue", {transition: "none"});

                            }else{
                                alert("El código QR que has escaneado no es válido")
                            }

                        }else{
                            alert("Por favor escanea un Código QR");
                        }
                    }

                },
                function (error) {
                    alert("Error leyendo código: " + error);
                }
            );

        }catch(err) {
            alert('Error leyendo código: ' + err);
        }

    });

    $("#FBConnect").on("click", function(){

        openFB.login('email',
            function() {

                openFB.api({
                    path: '/me',
                    success: function(data) {

                        //console.log(JSON.stringify(data));
                        user.fullName = data.name;
                        user.firstName = data.first_name;
                        user.lastName = data.last_name;
                        user.email = data.email;
                        console.log(JSON.stringify(user));

                        $.mobile.changePage("#page-welcome", {transition: "none"});
                    },
                    error: function(error){
                        alert('Error recuperando información de Facebook: ' + error.message)
                    }
                });


            },
            function(error) {
                alert('Error iniciando sesión: ' + error.error_description);
            });

    });

});

//It gets mobile events
var index_js = function(){

    var application;

    this.start = function(){

        application = new app(this);
        application.initialize(application.sender.onDeviceReady);

    }

    //Método invocado cuando el dispositivo esté listo
    this.onDeviceReady = function(e){

        //Iniciarlizar los eventos cuando el dispositivo esté listo
        //Evento Menú
        //aplicacion.escucharEvento(aplicacion.EVENTO_BOTON_MENU, aplicacion.sender.onBotonMenuPresionado);
        //Evento Botón Atrás
        //aplicacion.escucharEvento(aplicacion.EVENTO_BOTON_ATRAS, aplicacion.sender.onBotonAtrasPresionado);

        application.getCurrentPosition(application.sender.onPositionSuccess,  application.sender.onPositionError, {enableHighAccuracy: true});

    }

    this.onPositionSuccess = function(position) {

        currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        try{

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': currentPosition}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        currentAddress = results[1].formatted_address;
                        //Set Address
                        $("#address").html(currentAddress);

                    } else {
                        alert('No hay resultados de dirección found');
                    }
                } else {
                    alert('Fallo al obtener dirección: ' + status);
                }
            });

        }catch (error){
            alert(error);
        }


    }

    this.onPositionError = function (error) {

        alert('Error obteniendo la posición, código: ' + error.code    + '\n' + 'mensaje : ' + error.message + '\n');
    }

    this.onMenuButton = function (e) {

    }

    this.onBackButton = function (e) {

    }
}