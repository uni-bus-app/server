const admin = require('firebase-admin');
const Observable = require('rxjs/Observable').Observable;

function addUser(email, idToken) {
    return Observable.create(observer => {
        if(idToken==null) {
            observer.next({"message": "Unauthorised"});
        } else {
            admin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                admin.auth().verifyIdToken(idToken)
                admin.auth().createUser({
                email: email
                }).then(function(userRecord) {
                    // See the UserRecord reference doc for the contents of userRecord.
                    observer.next('Successfully created new user: '+ userRecord.uid);
                })
                .catch(function(error) {
                    observer.next('Error creating new user:', error);
                });   
            })
            .catch(error => {
                observer.next({"message": error});
            });
        }
    });
}

function listUsers(idToken) {
    return Observable.create(observer => {
        if(idToken==null) {
            observer.next({"message": "Unauthorised"});
        } else {
            admin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                admin.auth().listUsers(1000)
                .then(listUsersResults => {
                    observer.next(listUsersResults);
                })
                .catch(error => {
                    console.log("error listening uers")
                    observer.next(null);
                });    
            })
            .catch(error => {
                observer.next({"message": error});
            });
        }
    });
}

function deleteUser(uid, idToken) {
    return Observable.create(observer => {
        if(idToken==null) {
            observer.next({"message": "Unauthorised"});
        } else {
            admin.auth().verifyIdToken(idToken)
            .then(decodedToken => {
                admin.auth().deleteUser(uid)
                .then(() => {
                    observer.next({"message": "Successfully deleted"});
                })
                .catch(error => {
                    observer.next({"message": "Error deleting user: "+error});
                });
            }).catch(error => {
                observer.next({"message": error});
            });
        }
    });
}

module.exports = {
    addUser,
    listUsers,
    deleteUser
}