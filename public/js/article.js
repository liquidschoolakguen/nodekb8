

$(document).ready(function () {

   
    
    if(document.getElementById("invisible")!=null){

        var x = document.getElementById("invisible").textContent;

        var k = document.getElementById("hier-kommt-was-rein")
        k.innerHTML += x;
    }

    


        if(document.getElementById("invisible2")!=null){

            var x2 = document.getElementById("invisible2").textContent;

            var k2 = document.getElementById("hier-kommt-was-rein2")
            k2.innerHTML += x2;

        }
 




    $('.delete-article').on('click', function (e) {







        var result = confirm("Wenn du deinen Auftrag löscht, werden auch die entsprechenden Hausarbeiten gelöscht?");
 
              if(result)  {
                $target = $(e.target);
                const id = $target.attr('data-id');
                $.ajax({
                    type: 'DELETE',
                    url: '/articles/' + id,
                    success: function (response) {
        
                        //alert('delete article');
                        window.location.href = '/';
                    },
                    error: function (err) {
                        window.location = "http://localhost:5000";
                    }
                });
              } else {
                  
              }





        
        
        
    });


   


















});




