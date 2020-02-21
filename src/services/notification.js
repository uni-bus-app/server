const webpush = require('web-push');

export class Notification {

    subscription;

    constructor() {}

    subscribe(req) {
        this.subscription = req.body.notification;
        console.log(`Subscription received`);
        const payload = JSON.stringify({
            notification: {
                title: 'Subscribed',
                body: 'Subscription successful'
            }
            });
        webpush.sendNotification(this.subscription, payload)
            .catch(error => console.error(error));
        
    }


    sendNotification(input) {
        console.log(input)
        const message = JSON.stringify({
            notification: {
                title: input.title,
                body: input.message
            }
        });
        webpush.sendNotification(this.subscription, message)
            .catch(error => console.log(error));
    }
}