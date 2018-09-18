import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const cors = require("cors")
const express = require('express');

admin.initializeApp(functions.config().firebase);

const router = express.Router();
const db = admin.database();
const app = express()



app.get('/saveLocation', function (req, res) {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let userid = req.query.userid;
    let ownerid = req.query.ownerid;

    db.ref("users/" + ownerid + "/members/").child(userid).set({
        lastmovement: Date.now(),
    })

    res.send("updated");


})



app.get('/sendNotification', async function (req, res) {
    let token=req.query.token;
    let messaging=req.query.message;

    let message = {
        notification: {
          title: messaging,
          icon : "ic_launcher"
        },
      };
      

    /*let message = {
        data: {
          title: messaging,
          icon : "ic_launcher"
        },
    };*/

       let options = {
            priority: "high",
            sound: "default",
            timeToLive: 60 * 60 *24,
            show_in_foreground: true,
      };
      
      //admin.messaging().send(message)
      admin.messaging().sendToDevice(token, message, options)
      .then(function(response) {
        console.log("Successfully sent message:", response);
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
      });
     
        res.send("Location saved");
});



const api = functions.https.onRequest(app)

module.exports = {
    api
}