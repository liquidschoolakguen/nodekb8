/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch (e) { }
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));



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







setTimeout(function () {


	$.cookie('last-scroll-top', $(window).scrollTop());
	document.location.reload(true);



}, 180 * 1000);




function open_new_window(link) {
	alert(obj.getAttribute("href"));
	return false;
}



