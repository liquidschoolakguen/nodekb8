/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */




$('#bologna-list a').on('click', function (e) {


	e.preventDefault()
	$(this).tab('show')
	console.log($(this).tab('show'))

	//$('#bologna-list a').tab('show')


})



$(document).ready(function () {






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
		  "paging": false,

		 
	
		

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








