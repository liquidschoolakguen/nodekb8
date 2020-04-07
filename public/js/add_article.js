

$(document).ready(function () {


  




    window.onbeforeunload = function() {
        myFunction();
        
       // document.getElementById('geht_ab').submit();
            // $(.geht_ab).click();
         
           
     return 'htrd';
       
    }



    function myFunction(){

        console.log('jjj');

       // $('#reused_form #geht_ab').submit();

       // var value = $("#a").find("#b")

    }




    $( "#reused_form" ).submit(function( event ) {
        //alert( "Handler for .submit() called." );


        window.onbeforeunload = function() {
            
        }



        //event.preventDefault();
      });




    


});


$('#bologna-list a').on('click', function (e) {


    e.preventDefault()
    $(this).tab('show')
})


$(".custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  });



