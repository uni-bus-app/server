import * as admin from 'firebase-admin';
import { Observable } from 'rxjs';

//const serviceAccount = require('./bustimetable-261720-5b5ea4ecc551.json')

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount)
    credential: admin.credential.applicationDefault()
})

const db = admin.firestore();

export class Notification {
    constructor() {}

    getCurrent() {
        return Observable.create(observer => {
            db.collection('notifications').get().then(data => {
                let result = new Array;
                data.forEach(doc => {
                    result.push(doc.data());
                });
                observer.next(result);
            });
        });
    }

    setCurrent() {console.log("Reece is a nonce")}
}