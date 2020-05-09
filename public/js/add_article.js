

$(document).ready(function () {







    window.onbeforeunload = function () {
        myFunction();

        // document.getElementById('geht_ab').submit();
        // $(.geht_ab).click();


        return 'htrd';

    }



    function myFunction() {

        //console.log('jjj');

        // $('#reused_form #geht_ab').submit();

        // var value = $("#a").find("#b")

    }




    $("#reused_form").submit(function (event) {
        //alert( "Handler for .submit() called." );


        window.onbeforeunload = function () {

        }



        //event.preventDefault();
    });







});


$('#bologna-list a').on('click', function (e) {


    e.preventDefault()
    $(this).tab('show')
})


$(".custom-file-input").on("change", function () {
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



$('.ggg').click(function () {
    $('.divo_alt').show();
    $('.divo_neu').hide();
    this.style.display = 'none'
});




var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],
    ['image']                                        // remove formatting button
];
var quill = new Quill('#editor', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow',
    placeholder: '(Bei der Erstellung eines Auftrags kann es mit dem Firefox zu Darstellungsproblemen kommen. Nutze am Besten den Chrome-Browser oder einen anderen)'
});


$('#geht_ab').click(function () {
    var delta = quill.getContents();
    //console.log(JSON.stringify(delta));


    var control_delta = JSON.stringify(delta).replace(/\s/g, '') ;
   // console.log(control_delta);

    var uploadField = document.getElementById("inputGroupFile02");
    var allet =0;
    for (var i = 0, f; f = uploadField.files[i]; i++) {
    //hier werden die dateigrößen der dateien addiert.
    allet = allet + f.size
    }


    if(control_delta.length === 25 && uploadField.files.length === 0){
        alert("Du hast weder einen Aufrag formuliert noch eine Datei hochgeladen. Irgend etwas solltest du den SchülerInnen schon zu tun geben. ");
        //var uploadField = document.getElementById("#to_clear");
        return false
    }else{

        $("#dada").val(JSON.stringify(delta));
        $("#my-spinner").removeClass('d-none');
        return true

    }


});



   








