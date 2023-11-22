import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import React, {  useState, useEffect } from 'react';

// LoginSuccessful is a function sent in by parent component
function LoginForm({LoginEvent}) {
    const firebaseConfig = {
        apiKey: "AIzaSyC3j2r2IHEedw0ctXDJznrSB0jBHO6oG-c",
        authDomain: "bookslibrarylogin.firebaseapp.com",
        projectId: "bookslibrarylogin",
        storageBucket: "bookslibrarylogin.appspot.com",
        messagingSenderId: "766409930408",
        appId: "1:766409930408:web:2cc61ad0e4130703e4749d",
        measurementId: "G-GHYN1GWE1E"
      };

	initializeApp(firebaseConfig);

	const [loggedUser, setLoggedUser] = useState('');

	// function to sign in with Google's page
	const signInWithGoogle = () => {

  		const provider = new GoogleAuthProvider();
  		const auth = getAuth();
  		signInWithRedirect(auth, provider)
    	.then((result) => {
      		// User signed in
      		console.log(result.user);
      		setLoggedUser(result.user)

    	}).catch((error) => {
      	// Handle Errors here.
      		console.error(error);
    	});
	};

	// function to sign out
	function logoutGoogle () {
		const auth=getAuth();
		auth.signOut();
		setLoggedUser(null)
	}

	// we put the onAuthStateChanged in useEffect so this is only called when
	// this component mounts
	useEffect(() => {
		const auth = getAuth();
		auth.onAuthStateChanged(user => {
			if (user) {
    			// User is signed in.
    			console.log("User is signed in:", user);


    			setLoggedUser(user);

  			} else {
    		// No user is signed in.
    			console.log("No user is signed in.");
  			}
  			LoginEvent(user);
  		});
	}, []);
	// note the ? to show either login or logout button
	return (
    <div >
    { loggedUser?
      <><p>user: {loggedUser.uid}</p> <button onClick={logoutGoogle}>Log out</button> </>
      :<button onClick={signInWithGoogle}>Sign in with Google</button>
    }

    </div>
  );

}
export default LoginForm;