import * as admin from 'firebase-admin';
import { Observable } from 'rxjs';


export class Account {


    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: 'uni-bus-backend',
                clientEmail: 'firebase-adminsdk-d418e@uni-bus-backend.iam.gserviceaccount.com',
                privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCq9qBjE+cxWyQB\n9JJix4q9FOd23fzHPjLklBi7b5OYl5jzw8BKJTS5b3Q8f2x2JwtFTYTBofq7kqQU\nF+ZCw1XesyXMac+MWwDbYWcfgP2ewuuOQDMFUz+/erTMv9wRJBQJAQE53wBaq4oO\n5N3b0a5THSG/TSpK8On1zi24uyPGWmbM9XNbg0psv3i3kno3wH8E4BYvpTbHkQWE\nwSVDrcC09deGTKb9CQK5gPtk0RLhpPWxjBb//cdnEqIK0TB/HuB7ixMTKte/yXnO\nrmI4LB5QeIZsQEFhyhkbz/gjHhlx9Vy26Z34GRr1rT4rrSy/Pt2T/JJ52R63/Ihn\nQJUMAKyFAgMBAAECggEAG7emvXlwGEiSTWjamijcvZatMiXVAh57lM3NNrI6Z9kI\nI1k0tzCnXCW4NB4P4RX9FfbL6QgQWlHGHTsvXy/udOUZjIsJFanOuUKQ5q18hj1M\nKwC4j4qgLAns/xcJ9ZN3q2qzdAT2DefVbGBpobux0L1z3QvZ0/2RXi3XrCVXAaTJ\nflC3GFkoAju0yIpa8sB9fpWtveVBGAcR4Tur2bJ4u7ySTaVYCA6JL7JBbT76VD0M\nP4TSlCNbMD1DzFhn3V+Hr5eEmpCMFm084frNF4z83AaE1vsmz+39JE9D8rV/TmNk\nYosMhyCYuQYoWg3CRrqxeDsrn16KYaWVoAhBxX/2jwKBgQDdITY+eEm6TkiLGnEh\nZKnGUkSwwAsVoazUGxLPEjJgLcyOS8UmbL3R5OAMeQyc6l7E5IqE/KrKoEIIiu5o\np6ZZEmTKpm7AGCqBoODqCNbRult1mM2TnjasXBkQx5NjuZNeOI7x3LlpXwF+e8UV\nJyvpcVTX71P5mXKLLydO2ooc/wKBgQDF7D+0Ze5tEsQRYg6eTedwigVdW9ZXCfZ5\ncBGRmoTU3hu1UOF3zMiPiJDsjkQUW2Hzccof0lfZudhzAdSd0cqPBXwh2ULnvrgS\nWf14cxEan6le7xFQGwp7d4xEhlFMUSDYmYV/SMiSxx0+zfwngA2l8vEzuT74TvbY\nnCJ/sNVCewKBgQCPvawOFZEPex2q1ohdhZraoNWn814BNLQsuGCUnCaE4KCMivJf\n1OXbD6UYVoN9aNgrssfcRIYc6umhtfXdr8TxN4SvOlrZoZvX4aTyXMaPVE1pdueD\nIqA1kDR29NR5ScNixu8chzc7KJfHCVuGMY1Y1OOq7havNDECCqfJmUOYLwKBgQCQ\nQEiJ3YSxgGzgUnxfCl51GlMgoO+ODlfSWEilu122m47MTn+Vxe4jFqCxmFqsD5JL\nURLEsJSQvi+wWpQw1hdwt8mqDeQCbXFRBr+DSzIbGmTiKRGQNbUlGZNk2hRkr/hl\nhTbT9yMgPvjkrlJqI51O5sq/LPNlHIAyjVFjiWlVAwKBgDMOGS6BHRd70sq5inLh\nXmtsGXnvkaeKA1k5ssJel62jbEbxDTRvtQdk534KpR2XkD45YaGL6InfoNlsdNhp\nnCc8z16oIkCzxLIFbksz5fpyeAV61AUECo+F+sGz4ueO2oQ3zXZsuufrhkjr1na3\nK16IlrzhcmNZSUSmHz6Tpz/m\n-----END PRIVATE KEY-----\n'
            })
        });
    }

    addUser(email, idToken) {
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

    listUsers(idToken) {
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

    deleteUser(uid, idToken) {
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
}