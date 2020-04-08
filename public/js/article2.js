

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







    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
      });
    
    
      $('.custom-file-input').change(function (e) {
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).next('.custom-file-label').html(files.join(', '));
    });







});
