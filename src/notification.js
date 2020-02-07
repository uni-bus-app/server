const webpush = require('web-push');

export class Notification {

    subscription;

    constructor() {}

    subscribe(req) {
        this.subscription = req.body.notification;
        console.log(`Subscription received`);
        const payload = JSON.stringify({
            notification: {
                title: 'Notifications are cool',
                body: 'Know how to send notifications through Angular with this article!',
                icon: 'https://www.shareicon.net/data/256x256/2015/10/02/110808_blog_512x512.png',
                vibrate: [100, 50, 100],
                data: {
                url: 'https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac'
                }
            }
            });
        webpush.sendNotification(this.subscription, payload)
            .catch(error => console.error(error));
        webpush.
        
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