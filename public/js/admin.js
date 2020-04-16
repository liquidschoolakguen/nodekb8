$( function() {







    var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];


    var parameters = { search: 'boo' };
    $.get( '/schools/searching',parameters, function(data) {
        console.log(data)
      
        $( "#tags" ).autocomplete({
            source: data
          });

  });


   
  } );