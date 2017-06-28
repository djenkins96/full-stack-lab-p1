var $chirpButton = $('#chirp-btn');
var $chirpField = $('#chirp-field');
var $chirpList = $('#chirp-list');
var $user = $('#user');

$chirpField.on('input', function(){
    var isEmpty = $chirpField.val().length === 0 || $user.val() === 'Select User';
    $chirpButton.prop('disabled', isEmpty);
});

$chirpButton.click(postChirp);


function postChirp() {
    var chirp = {
        message: $chirpField.val(),
        userid: $user.val(),  
        // timestamp: new Date().toISOString()
    };
    $.ajax({
        method:'POST',
        url: '/api/chirps',
        contentType: 'application/json',
        data: JSON.stringify(chirp)
    }).then(function(success){
        $chirpField.val(''); 
        $chirpButton.prop('disabled', true);
        getChirps();
    }, function(err){
        console.log(err);
    });
}

function getChirps() { 
    $.ajax({
        method: 'GET',
        url: '/api/chirps'
    }).then(function(chirps){
        $chirpList.empty();
        for (var i = 0; i < chirps.length; i++){
            addChirpDiv(chirps[i]);
        }
    }, function(err) {
        console.log(err);
    });
}

getChirps();

// function deleteChirp(id) {
//     $.ajax({
//         method: 'DELETE',
//         url: '/api/chirps/' + id
//     }).then(function(){
//         getChirps();
//     }, function (err){
//         console.log(err);
//     })
// }

function addChirpDiv (chirp) {
    var $chirpDiv = $('<div class="chirp"></div>');
            
            var $user = $('<h4></h4>');
            var $timestamp = $('<h5></h5>');
            var $message = $('<p></p>');
            var $link = $('<a></a>');
            $link.attr('href', '/chirps/' + chirp.id);
            $message.text(chirp.message);
            $user.text(chirp.userName);
            $timestamp.text(new Date(chirp.timestamp).toLocaleString());
            $user.appendTo($chirpDiv);
            $message.appendTo($chirpDiv);
            // $deleteBtn.appendTo($chirpDiv);
            $timestamp.appendTo($chirpDiv);
            $chirpDiv.appendTo($link);
            $link.appendTo($chirpList);


}

function populateUsers(){
    $.ajax({
        method:'GET',
        url: '/api/users'
    }).then(function(users){
        for(var i = 0; i < users.length; i++){
            var $userOption = $('<option value="' + users[i].id + '">' + users[i].name + '</option>');
            $user.append($userOption);
        }
    }, function (err) {
        console.log(err);
    })
}
populateUsers();
