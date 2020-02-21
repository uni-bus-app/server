const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:info@unib.us', 
    "BKscmwsT8ZKN3sCQyZiUBR3vPyUm6nyKPpTwDcg4z-5aPDPfZru73MvsLifer5uvrjfIljmu9pLRlrW94SYl2UQ", 
    "29WTI_2s53Nk5IrUJsAWIk0N-JH_SR4rpvRqd7-JuFU");

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