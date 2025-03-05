// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import auth, { firebase } from "@react-native-firebase/auth";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";


// GoogleSignin.configure({
//   webClientId:"317063348459-mqt0tt10giu9mlftrptdvkhs8ohlupds.apps.googleusercontent.com",
//   scopes: ["profile", "email"]
// }); 

// const app = () => {
//   // State for login status and form type
//   const [loggedIn, setLoggedIn] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false); // true for signup, false for signin
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   // Handles sign-in/sign-up form submission
//   const handleFormSubmit = () => {
//     if (isSignUp) {
//       auth()
//         .createUserWithEmailAndPassword(email, password)
//         .then((val) => console.log(val))
//         .catch((err) => console.log(err));

//       console.log("Signing Up with:", { email, password });
//     } else {
//       auth()
//         .signInWithEmailAndPassword(email, password)
//         .then((val) => console.log(val))
//         .catch((err) => console.log(err));
//       console.log("Signing In with:", { email, password });
//     }
//     // Simulate login
//     setLoggedIn(true);
//   };

//   function onAuthStateChanged(user) {
//     setUser(user);
//     if (user) setLoggedIn(true);
//     else setLoggedIn(false);
//     if (initializing) setInitializing(false);
//   }

//   async function onGoogleButtonPress() {
//     // Check if your device supports Google Play
//     await GoogleSignin.signOut();
//     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//     // Get the users ID token
//     const googleSignInResult = await GoogleSignin.signIn();

//     // Create a Google credential with the token
//     const googleCredential = auth.GoogleAuthProvider.credential(
//       googleSignInResult.data?.idToken
//     );

//     // Sign-in the user with the credential
//     return await auth().signInWithCredential(googleCredential);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   // Handles sign-out
//   const handleSignOut = () => {
//     auth()
//       .signOut()
//       .then(() => console.log("User signed out!"));
//     setLoggedIn(false);
//     setEmail("");
//     setPassword("");
//   };

//   // console.log("User:", user);

//   if (loggedIn) {
//     return (
//       <View style={styles.center}>
//         <Button title="Sign Out" onPress={handleSignOut} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Button
//         title="Sign In with Google"
//         color="#4285F4"
//         onPress={() =>
//           onGoogleButtonPress().then((val) =>{
//             // console.log(val, "Signed in with Google!")
//             let userdetails = {
//               "id" :val.user._auth._user.uid,
//               "name":val.user._auth._user.displayName,
//               "email":val.user._auth._user.email


//             }
//             console.log(userdetails)
//             // console.log(val.user._auth._user.uid)
//           }
//           )
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//   },
// });

// export default app;






import React from "react";

import Container from "./Components/Container";

export default function App() {


  //sha1  AD:AE:50:D1:5F:F4:D6:3D:A9:50:E1:97:03:82:10:00:04:19:F3:32
  //client id android 775725503280-j9qek6lbckhpcp95ol1o9ncmf52q73dc.apps.googleusercontent.com
  // clientid web 775725503280-2rh9fqhvkl3odc7iveu14mu3s90sf4r7.apps.googleusercontent.com
  // web client secret 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



  return <Container />;
}
