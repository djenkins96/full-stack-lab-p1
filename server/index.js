var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var path = require('path');

var clientPath = path.join(__dirname, '../client');
var app = express();
app.use(bodyParser.json());
app.use(express.static(clientPath));

app.get('/chirps', function (req, res) {
    res.sendFile(path.join(clientPath, 'list.html'));
});

app.get('/chirps/*/update', function (req, res) {
    res.sendFile(path.join(clientPath, 'single_update.html'));
});

app.get('/chirps/*', function (req, res) {
    res.sendFile(path.join(clientPath, 'single_view.html'));
});



var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'labUser',
    password: 'lab15',
    database: 'Chirper'
});

app.route('/api/chirps')
    .get(function (req, res) {
        rows('allChirps')
            .then(function (chirps) {
                res.send(chirps);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }).post(function (req, res) {
        var newChirp = req.body;
        row('insertChirp', [newChirp.message, newChirp.userid])
            .then(function (id) {
                res.status(201).send(id);
            }).catch(function (err) {
                res.sendStatus(500);
            });
    });



app.route('/api/chirps/:id')
    .get(function (req, res) {
        row('getChirp', [req.params.id])
            .then(function (chirp) {
                res.send(chirp);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }).put(function (req, res) {
        empty('updateChirp',[req.params.id, req.body.message])
            .then(function () {
                res.sendStatus(204);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });
    }).delete(function (req, res) {
        empty('deleteChirp', [req.params.id])
            .then(function () {
                res.sendStatus(204);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });

    });

app.get('/api/users', function (req, res) {
    rows('GetUsers')
        .then(function (users) {
            res.send(users);
        }).catch(function (err) {
            console.log(err);
            res.sendStatus(500);
        });
});


app.listen(3000)





function callProcedure(procedureName, args) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            connection.release();
            if (err) {
                reject(err);
            } else {
                var placeholder = '';
                if (args && args.length > 0) {
                    for (var i = 0; i < args.length; i++) {
                        if (i === args.length - 1) {
                            placeholder += '?'
                        } else {
                            placeholder += '?,';
                        }
                    }
                }
                var callString = 'CALL ' + procedureName + '(' + placeholder + ')';
                connection.query(callString, args, function (err, resultsets) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(resultsets);
                    }
                })
            }
        })
    });
}

function rows(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function (resultsets) {
            return resultsets[0];
        })
}

function row(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function (resultsets) {
            return resultsets[0][0]
        })
}

function empty(procedureName, args) {
    return callProcedure(procedureName, args)
        .then(function () {
            return;
        });
}




// function getChirps(){
//     return new Promise (function (resolve, reject){
//         pool.getConnection(function (err, connection) {
//             if (err){
//                 reject(err);
//             } else {
//                 connection.query("CALL allChirps();", function (err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve (resultsets[0]);
//                     }
//                 });
//             }
//         });
//     });
// }

// function insertChirp(message, user) {
//     return new Promise(function (resolve, reject){
//         pool.getConnection(function (err, connection){
//             if (err) {
//                 reject(err);
//             } else {
//                 var parameterValues = [message, user];
//                 connection.query('CALL insertChirp(?, ?);', parameterValues, function (err, resultsets) {
//                     connection.release();
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(resultsets[0][0])
//                     }
//                 });
//             }
//         });
//     });
// }

// function chirpDelete(id) {
//     return new Promise(function(resolve, reject){
//         pool.getConnection(function(err,connection){
//             if (err){
//                 reject(err);
//             } else {
//                 connection.query('CALL deleteChirp(?);',[id], function(err) {
//                     connection.release();
//                     if (err){
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 });
//             }
//         });
//     });
// }
