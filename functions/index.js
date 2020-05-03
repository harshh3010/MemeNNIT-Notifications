const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.firestore.document('Notifications/{username}').onWrite(async (event) =>{

    const recieverUsername = event.after.get('recieverUsername');
    const title = event.after.get('title');
    const content = event.after.get('content');
    const notification_type = event.after.get('type');

    let userDoc = await admin.firestore().doc(`Users/${recieverUsername}`).get();
    let fcmToken = userDoc.get(`fcm`);
    
    var payload = {
        notification: {
            title: title,
            body: content
        },
        data: {
            n_type: notification_type
        }
    };

    var options = {
        priority: "normal",
        timeToLive: 60 * 60
    };
    
    admin.messaging().sendToDevice(fcmToken, payload, options)
        .then(function(response) {
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });    

});