

$(document).ready(function () {


    
   
    $('.delete-stammverbund').on('click', function (e) {







        var result = confirm("Wenn du den Klassenverbund löscht, passieren Sachen");
 
              if(result)  {
                $target = $(e.target);
                const id = $target.attr('data-id');
                $.ajax({
                    type: 'DELETE',
                    url: '/stammverbunds/stammverbund/' + id,
                    success: function (response) {
        
                        //alert('delete article');
                        window.location.href = '/';
                    },
                    error: function (err) {
                        window.location.href = '/';
                    }
                });
              } else {
                  
              }





        
        
        
    });


   


















});
