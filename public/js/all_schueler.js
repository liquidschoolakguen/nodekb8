


$('#bologna-list a').on('click', function (e) {


	e.preventDefault()
	$(this).tab('show')
	console.log($(this).tab('show'))

	//$('#bologna-list a').tab('show')


})



$(document).ready(function () {



	var lastScrollTop = $.cookie('last-scroll-top');
	if (lastScrollTop) {
		$(window).scrollTop(lastScrollTop);
		$.removeCookie('last-scroll-top');
	}





	$('#dtOrderExample').DataTable({
		"order": [[3, "desc"]]
	});



	$('.dataTables_length').addClass('bs-select');


	$(".clickable-row").click(function () {
		window.location = $(this).data("href");
	});



	/* 
		$('#customerTable').DataTable( {
			"pageLength": 10,
			"lengthChange": false,
			"searching": false
		} );
	 */

	oTable = $('#customerTable').DataTable({
		
		"lengthChange": false,
		"bInfo" : false,

		"language": {
			"paginate": {
			  "previous": "zurück",
			
				"next": "vor"
			  }
		  },
		  
		  "aLengthMenu": [[25, 50, 100, -1], [25, 50, 100, "All"]],
		  "iDisplayLength": 50

	});




	oTableE = $('#customerTable_Erklaerung').DataTable({
		
		"lengthChange": false,
		"bInfo" : false,
		"paging":   false,
        "ordering": false,
        "info":     false,
		  'columnDefs': [
			{
				"targets": 0, // your case first column
				"className": "text-center",
		   },
		   {
				"targets": 1,
				"className": "text-left",
		   }],





	});







    $('.delete-article').on('click', function (e) {



        var result = confirm("Wenn du diesen SoS löschst, werden auch die entsprechenden Hausarbeiten gelöscht?");
 
              if(result)  {
                $target = $(e.target);
                const id = $target.attr('data-id');
                $.ajax({
                    type: 'DELETE',
                    url: '/users/' + id,
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


   




	$('.delete-user').on('click', function (e) {



        var result = confirm("Wenn du diesen SoS löschst, werden auch die entsprechenden Hausarbeiten gelöscht?");
 
              if(result)  {
                $target = $(e.target);
				const id = $target.attr('data-id');
				alert('delete user '+id);
                $.ajax({
                    type: 'DELETE',
                    url: '/users/' + id,
                    success: function (response) {
        
                      
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



$("#inputFilter").on("keyup", function () {

	/* 	var inputValue = $(this).val().toLowerCase();
		$("#customerTable tr").filter(function () {
			$(this).toggle($(this).text().toLowerCase().indexOf(inputValue) > -1)
		});
	 */
	oTable.search($(this).val()).draw();

});








function open_new_window(link) {
	alert(obj.getAttribute("href"));
	return false;
}



