
var chirpNumber = window.location.pathname;
var pieces = chirpNumber.split('/');
var id = pieces[2];

var $editBtn = $('#edit-button');
var $deleteBtn = $('#delete-button');

$.ajax({
    method: 'GET',
    url: '/api/chirps/' + id
}).then(function (chirp) {
    addChirpDiv(chirp);
}, function(err){
    console.log(err);
});


function addChirpDiv(chirp) {
    var $chirpDiv = $('<div class="chirp"></div>');
    var $singleChirp = $('#single-chirp')
    var $user = $('<h4></h4>');
    var $timestamp = $('<h5></h5>');
    var $message = $('<p></p>');

    $message.text(chirp.message);
    $user.text(chirp.userName);
    $timestamp.text(new Date(chirp.timestamp).toLocaleString());
    $user.appendTo($chirpDiv);
    $message.appendTo($chirpDiv);
    $timestamp.appendTo($chirpDiv);
    $chirpDiv.appendTo($singleChirp);

}



$editBtn.click(function(){
    window.location.replace('/chirps/' +id +'/update')
})

$deleteBtn.click(function(){
      if (confirm('Do you wan\'t to delete this chirp??')) {
      deleteChirp(id);
    }
    
})

function deleteChirp(id) {
    $.ajax({
        method: 'DELETE',
        url: '/api/chirps/' + id
    }).then(function(){
        window.location.replace('/chirps')
    }, function (err){
        console.log(err);
    })
}

