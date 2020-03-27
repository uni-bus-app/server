const admin = require('firebase-admin');
const Observable = require('rxjs/Observable').Observable;

// const serviceAccount = require('D:/Downloads/bustimetable-261720-firebase-adminsdk-z2wl9-9bd0b645d7.json')

admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount)
    credential: admin.credential.applicationDefault()
})

const db = admin.firestore();



function getCurrent() {
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

function getCurrentServiceInfo() {
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

function setCurrent() {console.log("Reece is a nonce")}

module.exports = {
    getCurrent,
    getCurrentServiceInfo,
    setCurrent
}