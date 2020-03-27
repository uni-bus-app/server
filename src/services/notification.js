const admin = require('firebase-admin');
const Observable = require('rxjs/Observable').Observable;

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

function setCurrent() {console.log("")}

module.exports = {
    getCurrent,
    getCurrentServiceInfo,
    setCurrent
}