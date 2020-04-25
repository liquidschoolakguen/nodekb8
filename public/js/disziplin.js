

$(document).ready(function () {
    $('.delete-disziplin').on('click', function (e) {
        var result = confirm("Wenn du das Unterrichtsfach löschst, passieren Sachen");
        if (result) {
            $target = $(e.target);
            const id = $target.attr('data-id');
            $.ajax({
                type: 'DELETE',
                url: '/disziplins/disziplin/' + id,
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
