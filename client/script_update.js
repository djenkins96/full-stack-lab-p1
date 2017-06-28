
var chirpNumber = window.location.pathname;
var pieces = chirpNumber.split('/');
var id = pieces[2];
// var $editBtn = $('#edit-button');
// var editChirp = $('#edit-chirp')



$.ajax({
    method: 'GET',
    url: '/api/chirps/' + id
}).then(function (chirp) {
    $('#chirp-message').val(chirp.message);
}, function(err) {
    console.log(err);
});

$('#update-button').click(function(){
    var payload = {
        message: $('#chirp-message').val()
    };
    $.ajax({
        method: 'PUT',
        url: '/api/chirps/' + id,
        contentType: 'application/json',
        data: JSON.stringify(payload)
    }).then(function(){
        window.location.replace('/chirps');
    }, function(){
        console.log(err);
    });
});


