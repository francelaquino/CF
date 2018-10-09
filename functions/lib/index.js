"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require("cors");
const express = require('express');
admin.initializeApp(functions.config().firebase);
const router = express.Router();
const db = admin.database();
const app = express();
app.get('/saveLocation', function (req, res) {
    let lat = req.query.lat;
    let lon = req.query.lon;
    let userid = req.query.userid;
    let ownerid = req.query.ownerid;
    db.ref("users/" + ownerid + "/members/").child(userid).set({
        lastmovement: Date.now(),
        latitude: lat,
        longitude: lon
    });
    res.send("updated");
});
app.get('/sendNotification', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let token = req.query.token;
        let messaging = req.query.message;
        /*let message = {
            notification: {
              title: messaging,
              icon : "ic_launcher"
            },
          };
          */
        let message = {
            data: {
                title: "My GPS Buddy",
                body: messaging,
            },
        };
        let options = {
            priority: "high",
            sound: "default",
            timeToLive: 60 * 60 * 24,
            show_in_foreground: true,
        };
        //admin.messaging().send(message)
        admin.messaging().sendToDevice(token, message, options)
            .then(function (response) {
            console.log("Successfully sent message:", response);
        })
            .catch(function (error) {
            console.log("Error sending message:", error);
        });
        res.send("Location saved");
    });
});
const api = functions.https.onRequest(app);
module.exports = {
    api
};
//# sourceMappingURL=index.js.map