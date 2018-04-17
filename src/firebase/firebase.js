 import * as firebase from 'firebase'
 
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBr7KSSCpM-cJMPgHqHKeS8ALL_069cyAs",
    authDomain: "marks-2f905.firebaseapp.com",
    databaseURL: "https://marks-2f905.firebaseio.com",
    projectId: "marks-2f905",
    storageBucket: "marks-2f905.appspot.com",
    messagingSenderId: "989220054028"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  
  const auth = firebase.auth();
  const db = firebase.database();

  const providerGoogle = new firebase.auth.GoogleAuthProvider();
  
  export {
    auth,
    db,
    providerGoogle,
  };