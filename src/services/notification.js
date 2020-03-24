import * as admin from 'firebase-admin';
import { Observable } from 'rxjs';

const serviceAccount = require('D:/Downloads/bustimetable-261720-firebase-adminsdk-z2wl9-9bd0b645d7.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // credential: admin.credential.applicationDefault()
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

    getCurrentServiceInfo() {
        return Observable.create(observer => {
            db.collection('serviceinfo').get().then(data => {
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