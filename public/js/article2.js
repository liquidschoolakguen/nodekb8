

$(document).ready(function () {



    //brauche ich, damit die Hausarbeit beim reload nicht verschwindet
    window.onbeforeunload = function () {
        myFunction();

        return 'htrd';

    }

    function myFunction() {

        console.log('jjj');


    }


    $("#reused_form").submit(function (event) {
        //alert( "Handler for .submit() called." );


        window.onbeforeunload = function () {

        }
    });
    /////////////////////////////////////////////////////////7








    $("#reused_form2").submit(function (event) {
        //alert( "Handler for .submit() called." );


        window.onbeforeunload = function () {

        }
    });
    /////////////////////////////////////////////////////////7















});
