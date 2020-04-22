

$(document).ready(function () {
    $('.delete-stamm').on('click', function (e) {
        var result = confirm("Wenn du das Unterrichtsfach löschst, passieren Sachen");
        if (result) {
            $target = $(e.target);
            const id = $target.attr('data-id');
            $.ajax({
                type: 'DELETE',
                url: '/schools/stamm/' + id,
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
