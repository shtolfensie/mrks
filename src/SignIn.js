import React, { Component } from 'react'

import { Button, } from 'semantic-ui-react'

import { auth, providerGoogle } from './firebase'



const SignInButton = (props) => {

  const handleGoogleSignIn = () => {
    auth.signInWithPopup(providerGoogle).then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      
      console.log(user);
      console.log(token);
      
  
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  return (
    <div>
      <Button onClick={handleGoogleSignIn} >
        Sign In
      </Button>
      <Button onClick={() => auth.signOut()} >
        Sign Out
      </Button>
    </div>
  )
}



export default SignInButton;