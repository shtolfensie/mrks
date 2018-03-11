 import * as firebase from 'firebase'
 
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBL5ADb05I6Fuf5J5de0EJHmff45h3-gNk",
    authDomain: "life-69419.firebaseapp.com",
    databaseURL: "https://life-69419.firebaseio.com",
    projectId: "life-69419",
    storageBucket: "life-69419.appspot.com",
    messagingSenderId: "840427893914"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  
  const auth = firebase.auth();
  const db = firebase.database();
  
  export {
    auth,
    db,
  };