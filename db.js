const admin = require("firebase-admin");
const config = require("./config");

const db = admin.initializeApp({
    credential: admin.credential.cert(config.firebaseConfig),
});

// const firebase = require("firebase");
// const db = firebase.initializeApp(config.firebaseConfig);

module.exports = db;
